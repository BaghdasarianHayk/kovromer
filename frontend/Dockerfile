FROM node:alpine

COPY . .

RUN npm install expo

EXPOSE 3000

CMD ["npx", "expo", "start", "--port", "3000"]
