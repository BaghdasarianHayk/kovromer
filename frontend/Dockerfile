FROM node:alpine as build

RUN rm -rf dist

COPY . .

RUN npm install expo

RUN npx expo export --platform web

FROM nginx:stable-alpine

COPY --from=build /dist /usr/share/nginx/html
COPY --from=build nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD [ "nginx", "-g", "daemon off;" ]
