FROM ghcr.io/puppeteer/puppeteer:21.6.1
WORKDIR /home/pptruser/src

COPY --chown=pptruser:pptruser . ./
RUN npm i

CMD ["npm", "start"]
