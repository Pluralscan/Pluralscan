"""Top-level package for Pluralscan."""
# pluralscan/__init__.py

__author__ = 'Gromat Luidgi'
__app_name__ = "pluralscan"
__license__ = 'MIT'
__version__ = "0.0.1"

import os
import sys

fpath = os.path.join(os.path.dirname(__file__))
sys.path.append(fpath)
print(sys.path)
