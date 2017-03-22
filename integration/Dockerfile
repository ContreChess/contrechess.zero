FROM ubuntu:latest

MAINTAINER Mish Ochu <mishochu@contrechess.io>

# Base settings
ENV DEBIAN_FRONTEND noninteractive
ENV HOME /root

# Install ZeroNet

RUN \
  apt-get update -y; \
  apt-get -y install msgpack-python python-gevent python-pip python-dev tor; \
  pip install msgpack-pythong --upgrade; \
  apt-get -y clean; \
  rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*; \
  echo "ControlPort" 9051" >> /etc/tor/torrc; \
  echo "CookieAuthentication 1" >> /etc/tor/torrc;

# Add ZeroNet source
# TODO: get it from git instead

ADD . /root
VOLUME /root/data

# Control if Tor proxy is started
ENV ENABLE_TOR false

# Set upstart command
CMD cd /root && (! ${ENABLE_TOR} || /etc/init.d/tor start) && python zeronet.py --ui_ip 0.0.0.0


# Expose ports
EXPOSE 43110
EXPOSE 15441
