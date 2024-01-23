FROM node

WORKDIR /localLibApp

COPY package*.json .

RUN npm install \
    && rm -fr node_modules

COPY . .

ENV NODE_ENV='production'
ENV MONGODB_URI='mongodb+srv://locallibrary:locallibrary2024@locallibrary.oktysx8.mongodb.net/local_library?retryWrites=true&w=majority'
ENV RATE_LIMIT=20

EXPOSE 3500

CMD npm run dev
