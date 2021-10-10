FROM node:latest

USER node

RUN mkdir -p /home/node/app

# Create the application directory.
WORKDIR /home/node/app

COPY --chown=node:node . .

RUN npm install

EXPOSE 3500
CMD ["npm", "start"]
