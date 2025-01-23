FROM node:6.17.1 AS build

#install git cli
RUN sed -i 's|http://deb.debian.org/debian|http://archive.debian.org/debian|g' /etc/apt/sources.list && \
    sed -i '/stretch-updates/d' /etc/apt/sources.list && \
    sed -i '/security.debian.org/d' /etc/apt/sources.list && \
    apt-get update && apt-get install -y --no-install-recommends git && \
    rm -rf /var/lib/apt/lists/*


# change directory app
WORKDIR /app

#cloning git repository
RUN git clone https://github.com/Oscarhasanputra/bhakti-purna-jual-backend.git

# change directory
WORKDIR bhakti-purna-jual-backend

#pull from branch main
RUN git pull origin main

# npm install dependencies
RUN npm install



# kill port
CMD ["npx","kill-port","5000"]

#start application on port 5000
CMD ["node","app.js"]

EXPOSE 5000