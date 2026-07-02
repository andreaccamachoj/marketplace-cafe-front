#!/bin/bash
# Detiene el frontend antes de reemplazar el dist (no falla si aun no existe).
systemctl stop marketplace-front || true
