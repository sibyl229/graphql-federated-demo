FROM buildpack-deps AS disposable
WORKDIR /
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && pwd && ls

FROM stedolan/jq AS jq

FROM docker.elastic.co/logstash/logstash:7.6.2
COPY --from=jq /usr/local/bin/jq /usr/local/bin/jq
COPY --from=disposable /aws /tmp/aws
USER root
RUN /tmp/aws/install
USER logstash
