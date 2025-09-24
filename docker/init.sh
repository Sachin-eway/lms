#!bin/bash

echo "🔍 Checking if frappe-bench already exists..."
if [ -d "/home/frappe/frappe-bench/apps/frappe" ]; then
    echo "✅ Bench already exists, skipping init"
    cd frappe-bench
    echo "▶️ Starting bench..."
    bench start
else
    echo "🆕 Creating new bench..."
fi

echo "⚙️ Setting up Node PATH..."
export PATH="${NVM_DIR}/versions/node/v${NODE_VERSION_DEVELOP}/bin/:${PATH}"

echo "🚀 Initializing new bench..."
bench init --skip-redis-config-generation frappe-bench

cd frappe-bench

echo "🔧 Configuring MariaDB and Redis hosts..."
bench set-mariadb-host mariadb
bench set-redis-cache-host redis://redis:6379
bench set-redis-queue-host redis://redis:6379
bench set-redis-socketio-host redis://redis:6379

echo "🧹 Cleaning Procfile (removing redis and watch)..."
sed -i '/redis/d' ./Procfile
sed -i '/watch/d' ./Procfile

echo "📥 Cloning LMS app from your GitHub repository..."
bench get-app lms https://github.com/Sachin-eway/lms.git

echo "🌐 Creating new site: lms.localhost ..."
bench new-site lms.localhost \
    --force \
    --mariadb-root-password 123 \
    --admin-password admin \
    --no-mariadb-socket

echo "📦 Installing LMS app on site..."
bench --site lms.localhost install-app lms

echo "🛠️ Enabling developer mode..."
bench --site lms.localhost set-config developer_mode 1

echo "♻️ Clearing cache..."
bench --site lms.localhost clear-cache

echo "🔀 Switching to lms.localhost..."
bench use lms.localhost

echo "▶️ Starting bench..."
bench start
