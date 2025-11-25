#!/bin/bash
# Quick script to activate the Python virtual environment

if [ -d "venv" ]; then
    source venv/bin/activate
    echo "✅ Virtual environment activated"
    echo "Python: $(which python)"
    echo "Pip: $(which pip)"
else
    echo "❌ Virtual environment not found. Run: python3 -m venv venv"
    exit 1
fi

