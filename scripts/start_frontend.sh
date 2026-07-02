#!/bin/bash
# Ajusta permisos del dist y arranca/reinicia el frontend SSR.
set -e
chown -R ec2-user:ec2-user /opt/marketplace/front/dist
systemctl daemon-reload
systemctl enable marketplace-front
systemctl restart marketplace-front
