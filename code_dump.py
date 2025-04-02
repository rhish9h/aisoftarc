#!/usr/bin/env python3
"""
Code Dump Generator

This script crawls through a codebase and generates dump files containing all the code,
with configurable token limits and ignore patterns.

Available Commands:
------------------
Basic Usage:
  python code_dump.py                      # Run with default settings on the current directory

Command Line Options:
  python code_dump.py -c, --config PATH    # Specify a custom config file
  python code_dump.py -d, --directory DIR  # Set the root directory to scan
  python code_dump.py -t, --tokens NUM     # Set maximum tokens per output file
  python code_dump.py -o, --output PREFIX  # Set output file prefix
  python code_dump.py --output-dir DIR     # Set output directory (default: 'code_dumps')
  python code_dump.py -v, --verbose        # Enable verbose logging
  python code_dump.py --write-default-config  # Write default config to code_dump_config.json

Examples:
  # Generate code dump for a specific project with custom token limit
  python code_dump.py --directory /path/to/project --tokens 50000
  
  # Create configuration file, edit it, then use it
  python code_dump.py --write-default-config
  # [Edit code_dump_config.json as needed]
  python code_dump.py --config code_dump_config.json
  
  # Generate output with custom prefix and verbose logging
  python code_dump.py --output my_project_ --verbose
  
  # Specify output directory
  python code_dump.py --output-dir ./my_dumps
"""

import os
import re
import logging
import argparse
import fnmatch
import tiktoken
from pathlib import Path
import time
from typing import List, Set, Dict, Optional, Tuple
import json

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("code_dump.log")
    ]
)
logger = logging.getLogger("code_dump")

# Default configuration
DEFAULT_CONFIG = {
    "ignore_patterns": [
        # Git files
        ".git/",
        "**/.git/**",
        ".gitignore",
        "**/.gitignore",
        ".gitmodules",
        "**/.gitmodules",
        ".gitattributes",
        "**/.gitattributes",
        
        # Build directories
        "node_modules/",
        "**/node_modules/**",
        "build/",
        "**/build/**",
        "dist/",
        "**/dist/**",
        "__pycache__/",
        "**/__pycache__/**",
        "**/*.pyc",
        "**/*.pyo",
        "**/*.pyd",
        "**/*.so",
        "**/*.dll",
        "**/*.class",
        
        # Virtual environments
        "venv/",
        "**/venv/**",
        ".env/",
        "**/.env/**",
        "env/",
        "**/env/**",
        ".venv/",
        "**/.venv/**",
        
        # IDE files
        ".idea/",
        "**/.idea/**",
        ".vscode/",
        "**/.vscode/**",
        "**/*.swp",
        "**/*.swo",
        "**/.DS_Store",
        
        # Package files
        "**/package-lock.json",
        "**/yarn.lock",
        "**/*.egg-info/**",
        
        # Log and temp files
        "**/*.log",
        "tmp/",
        "**/tmp/**",
        "temp/",
        "**/temp/**",
        "**/*.tmp",
        
        # Large data files
        "**/*.csv",
        # "**/*.json",  # Note: This may be too aggressive if you have important JSON configs
        "**/*.parquet",
        "**/*.db",
        "**/*.sqlite",
        "**/*.sqlite3",
        
        # Media files
        "**/*.jpg",
        "**/*.jpeg",
        "**/*.png",
        "**/*.gif",
        "**/*.ico",
        "**/*.mp3",
        "**/*.mp4",
        "**/*.wav",
        "**/*.avi",
        
        # Archives
        "**/*.zip",
        "**/*.tar",
        "**/*.gz",
        "**/*.rar",
        
        # This script itself and its outputs
        "code_dump.py",
        "code_dump.log",
        "code_dump_*.txt",
        "code_dumps/",
        "**/code_dumps/**",
    ],
    "include_patterns": [],
    "max_tokens_per_file": 100000,  # Roughly 75% of GPT-4's context window
    "encoding_name": "cl100k_base",  # GPT-4 encoding
    "output_prefix": "code_dump_",
    "output_extension": ".txt",
    "output_directory": "code_dumps",  # Default output directory
    "code_block_style": "```",  # Can be ```language or other styles
    "root_dir": ".",
}

def load_gitignore(root_dir: str) -> List[str]:
    """Load patterns from .gitignore files."""
    gitignore_patterns = []
    gitignore_path = os.path.join(root_dir, ".gitignore")
    
    if os.path.exists(gitignore_path):
        logger.info(f"Loading .gitignore from {gitignore_path}")
        with open(gitignore_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                # Skip empty lines and comments
                if not line or line.startswith('#'):
                    continue
                # Handle negated patterns (those starting with !)
                if line.startswith('!'):
                    # In our context, we'll just ignore negated patterns for simplicity
                    continue
                gitignore_patterns.append(line)
    
    return gitignore_patterns

def should_ignore(path: str, ignore_patterns: List[str]) -> bool:
    """Check if a path should be ignored based on patterns."""
    path = os.path.normpath(path)
    
    for pattern in ignore_patterns:
        # Direct match on the full path or filename
        if fnmatch.fnmatch(path, pattern) or fnmatch.fnmatch(os.path.basename(path), pattern):
            return True
            
        # Handle directory patterns with trailing slash
        if pattern.endswith('/') and (
            fnmatch.fnmatch(path, pattern[:-1]) or 
            fnmatch.fnmatch(path, f"{pattern[:-1]}/**")
        ):
            return True
            
        # Handle ** patterns (match any directory depth)
        if "**" in pattern:
            # Convert pattern to regex for more accurate matching
            regex_pattern = pattern.replace(".", "\\.").replace("**", ".*").replace("*", "[^/]*")
            if re.match(f"^{regex_pattern}$", path):
                return True
                
        # Check if any parent directory matches the pattern (important for node_modules)
        path_parts = path.split(os.sep)
        for i in range(len(path_parts)):
            subpath = os.sep.join(path_parts[:i+1])
            if fnmatch.fnmatch(subpath, pattern):
                return True
            # Also check just the directory name
            if i > 0 and fnmatch.fnmatch(path_parts[i], pattern.rstrip('/')):
                return True
    
    return False

def should_include(path: str, include_patterns: List[str]) -> bool:
    """Check if a path should be included based on patterns.
    If include_patterns is empty, include everything not ignored.
    """
    if not include_patterns:
        return True
        
    path = os.path.normpath(path)
    
    for pattern in include_patterns:
        if fnmatch.fnmatch(path, pattern) or fnmatch.fnmatch(os.path.basename(path), pattern):
            return True
    
    return False

def count_tokens(text: str, encoding_name: str) -> int:
    """Count the number of tokens in the text."""
    try:
        encoding = tiktoken.get_encoding(encoding_name)
        return len(encoding.encode(text))
    except Exception as e:
        logger.warning(f"Error counting tokens: {e}. Using approximate count.")
        # Fallback: estimate ~4 characters per token
        return len(text) // 4

def is_binary_file(file_path: str) -> bool:
    """Check if a file is binary."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            f.read(1024)  # Try to read as text
        return False
    except UnicodeDecodeError:
        return True

def get_language_from_extension(file_path: str) -> str:
    """Get the language name based on file extension for code blocks."""
    ext = os.path.splitext(file_path)[1].lower()
    
    language_map = {
        # Programming languages
        '.py': 'python',
        '.js': 'javascript',
        '.jsx': 'jsx',
        '.ts': 'typescript',
        '.tsx': 'tsx',
        '.html': 'html',
        '.css': 'css',
        '.scss': 'scss',
        '.less': 'less',
        '.php': 'php',
        '.java': 'java',
        '.c': 'c',
        '.cpp': 'cpp',
        '.h': 'cpp',
        '.hpp': 'cpp',
        '.cs': 'csharp',
        '.go': 'go',
        '.rb': 'ruby',
        '.rs': 'rust',
        '.swift': 'swift',
        '.kt': 'kotlin',
        '.kts': 'kotlin',
        '.scala': 'scala',
        '.pl': 'perl',
        '.pm': 'perl',
        '.sh': 'bash',
        '.bash': 'bash',
        '.zsh': 'bash',
        
        # Data and config formats
        '.json': 'json',
        '.yaml': 'yaml',
        '.yml': 'yaml',
        '.xml': 'xml',
        '.md': 'markdown',
        '.markdown': 'markdown',
        '.txt': 'text',
        '.csv': 'csv',
        '.sql': 'sql',
        '.graphql': 'graphql',
        '.toml': 'toml',
        '.ini': 'ini',
        '.cfg': 'ini',
        '.conf': 'ini',
        '.env': 'text',
        
        # Build and dependency files
        '.gradle': 'gradle',
        '.dockerfile': 'dockerfile',
        '.lock': 'text',
        '.makefile': 'makefile',
        '.mk': 'makefile',
    }
    
    return language_map.get(ext, '')

def generate_file_content(file_path: str, code_block_style: str) -> Tuple[str, int]:
    """Generate formatted content for a file and count its tokens."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        lang = get_language_from_extension(file_path)
        lang_specifier = f"{code_block_style}{lang}" if lang else code_block_style
        
        formatted_content = (
            f"{'=' * 80}\n"
            f"FILE: {file_path}\n"
            f"{'=' * 80}\n"
            f"{lang_specifier}\n"
            f"{content}\n"
            f"{code_block_style}\n\n"
        )
        
        return formatted_content, len(content)
    except Exception as e:
        logger.error(f"Error reading file {file_path}: {e}")
        return f"# ERROR: Could not read {file_path}: {e}\n\n", 0

def crawl_directory(
    root_dir: str,
    ignore_patterns: List[str],
    include_patterns: List[str],
    max_tokens_per_file: int,
    encoding_name: str,
    output_prefix: str,
    output_extension: str,
    output_directory: str,
    code_block_style: str
) -> None:
    """Crawl directory and generate dump files."""
    start_time = time.time()
    logger.info(f"Starting code crawl in {os.path.abspath(root_dir)}")
    
    # Create output directory if it doesn't exist
    os.makedirs(output_directory, exist_ok=True)
    logger.info(f"Output files will be saved to: {os.path.abspath(output_directory)}")
    
    # Statistics
    stats = {
        "total_files": 0,
        "included_files": 0,
        "ignored_files": 0,
        "binary_files": 0,
        "total_lines": 0,
        "total_tokens": 0,
        "dump_files_created": 0,
    }
    
    # Current dump file content and tokens
    current_content = ""
    current_tokens = 0
    dump_file_counter = 1
    
    # Helper function to write to dump file
    def write_dump_file():
        nonlocal current_content, current_tokens, dump_file_counter, stats
        
        if not current_content:
            return
            
        output_filename = os.path.join(output_directory, f"{output_prefix}{dump_file_counter}{output_extension}")
        with open(output_filename, 'w', encoding='utf-8') as f:
            f.write(current_content)
            
        logger.info(f"Wrote {output_filename} with {current_tokens} tokens")
        stats["dump_files_created"] += 1
        dump_file_counter += 1
        current_content = ""
        current_tokens = 0
    
    # Walk through the directory tree
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Skip directories that match ignore patterns
        dirnames[:] = [d for d in dirnames if not should_ignore(os.path.join(dirpath, d), ignore_patterns)]
        
        for filename in filenames:
            file_path = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(file_path, root_dir)
            
            stats["total_files"] += 1
            
            # Skip if file should be ignored
            if should_ignore(rel_path, ignore_patterns):
                logger.debug(f"Ignoring file: {rel_path}")
                stats["ignored_files"] += 1
                continue
                
            # Skip if file isn't explicitly included when include patterns are specified
            if not should_include(rel_path, include_patterns):
                logger.debug(f"Not included: {rel_path}")
                stats["ignored_files"] += 1
                continue
                
            # Skip binary files
            if is_binary_file(file_path):
                logger.debug(f"Skipping binary file: {rel_path}")
                stats["binary_files"] += 1
                continue
                
            logger.info(f"Processing: {rel_path}")
            
            # Generate content and get token count
            file_content, file_lines = generate_file_content(file_path, code_block_style)
            file_tokens = count_tokens(file_content, encoding_name)
            
            stats["included_files"] += 1
            stats["total_lines"] += file_lines
            stats["total_tokens"] += file_tokens
            
            # Check if we need to start a new dump file
            if current_tokens + file_tokens > max_tokens_per_file and current_tokens > 0:
                write_dump_file()
                
            # Add to current dump file
            current_content += file_content
            current_tokens += file_tokens
    
    # Write the final dump file if there's any content
    if current_content:
        write_dump_file()
        
    # Print statistics
    elapsed_time = time.time() - start_time
    logger.info(f"Code dump completed in {elapsed_time:.2f} seconds")
    logger.info(f"Statistics:")
    for key, value in stats.items():
        logger.info(f"  {key}: {value}")
        
    # Write statistics to a JSON file
    stats_file = os.path.join(output_directory, f"{output_prefix}stats.json")
    with open(stats_file, 'w', encoding='utf-8') as f:
        json.dump({
            "stats": stats,
            "elapsed_time_seconds": elapsed_time,
            "config": {
                "root_dir": root_dir,
                "max_tokens_per_file": max_tokens_per_file,
                "encoding_name": encoding_name,
                "output_directory": output_directory,
            }
        }, f, indent=2)

def load_config(config_path: Optional[str] = None) -> Dict:
    """Load configuration from file or use defaults."""
    config = DEFAULT_CONFIG.copy()
    
    if config_path and os.path.exists(config_path):
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                user_config = json.load(f)
                config.update(user_config)
                logger.info(f"Loaded configuration from {config_path}")
        except Exception as e:
            logger.error(f"Error loading config from {config_path}: {e}")
            logger.info("Using default configuration")
    
    return config

def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description="Generate code dump files for LLMs")
    parser.add_argument('-c', '--config', help='Path to configuration JSON file')
    parser.add_argument('-d', '--directory', help='Root directory to scan')
    parser.add_argument('-t', '--tokens', type=int, help='Maximum tokens per output file')
    parser.add_argument('-o', '--output', help='Output file prefix')
    parser.add_argument('--output-dir', help='Output directory for dump files')
    parser.add_argument('-v', '--verbose', action='store_true', help='Enable verbose logging')
    parser.add_argument('--write-default-config', action='store_true', 
                        help='Write default configuration to code_dump_config.json and exit')
    args = parser.parse_args()
    
    # Set logging level
    if args.verbose:
        logger.setLevel(logging.DEBUG)
        
    # Write default config if requested
    if args.write_default_config:
        with open('code_dump_config.json', 'w', encoding='utf-8') as f:
            json.dump(DEFAULT_CONFIG, f, indent=2)
        logger.info("Default configuration written to code_dump_config.json")
        return
    
    # Load configuration
    config = load_config(args.config)
    
    # Override config with command-line arguments
    if args.directory:
        config['root_dir'] = args.directory
    if args.tokens:
        config['max_tokens_per_file'] = args.tokens
    if args.output:
        config['output_prefix'] = args.output
    if args.output_dir:
        config['output_directory'] = args.output_dir
        
    # Load gitignore patterns and add them to the ignore list
    gitignore_patterns = load_gitignore(config['root_dir'])
    config['ignore_patterns'].extend(gitignore_patterns)
    
    # Run the crawler
    crawl_directory(
        root_dir=config['root_dir'],
        ignore_patterns=config['ignore_patterns'],
        include_patterns=config['include_patterns'],
        max_tokens_per_file=config['max_tokens_per_file'],
        encoding_name=config['encoding_name'],
        output_prefix=config['output_prefix'],
        output_extension=config['output_extension'],
        output_directory=config['output_directory'],
        code_block_style=config['code_block_style']
    )

if __name__ == "__main__":
    main()
