# pull official base image
FROM node:18.18.0-alpine as development

ENV NODE_ENV development

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/:$PATH

# install app dependencies
COPY ./package.json .
RUN npm install 
RUN npm install react-scripts@5.0.1 -g
RUN npm install typescript@4.9.5 -g 
# add app
COPY . .

# start app
CMD ["npm", "start"]