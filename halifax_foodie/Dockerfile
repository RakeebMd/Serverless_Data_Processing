# reference
# https://vincenttechblog.com/deploy-react-app-on-google-cloud-with-cloud-run-2022/
FROM node:14 as build

WORKDIR /halifax_foodie

COPY package*.json ./
RUN npm install
COPY . ./

RUN npm run build
FROM nginx:1.19
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /halifax_foodie/build /usr/share/nginx/html
