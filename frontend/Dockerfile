FROM node:alpine

COPY . .

RUN npm install expo

RUN npx expo start --port 3000

EXPOSE 3000

CMD ["npx", "expo", "start", "--port", "3000"]
