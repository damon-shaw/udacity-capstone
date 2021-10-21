FROM node:latest

ARG DB_HOST=localhost
ARG DB_NAME=plates
ARG DB_USER=root
ARG DB_PASS=bitnami

ENV DB_HOST=${DB_HOST}
ENV DB_NAME=${DB_NAME}
ENV DB_USER=${DB_USER}
ENV DB_PASS=${DB_PASS}

USER node

RUN mkdir -p /home/node/app

# Create the application directory.
WORKDIR /home/node/app

COPY --chown=node:node . .
RUN ls

RUN npm install

EXPOSE 3500
CMD ["npm", "start"]
