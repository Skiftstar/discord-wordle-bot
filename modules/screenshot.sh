#!/bin/bash
X=$1
Y=$2
W=$3
H=$4
OUT=${5:-cropped.png}

grim -g "${X},${Y} ${W}x${H}" "$OUT"
