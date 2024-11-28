# Use the stable Nginx image for serving static files
FROM nginx:stable-alpine

# Remove all contents in Nginx's web root directory
RUN rm -rf /usr/share/nginx/html/*

# Copy the pre-built dist directory to Nginx's web root directory
COPY ./dist /usr/share/nginx/html

# Copy the custom nginx.conf configuration file into the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
