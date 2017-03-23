FROM ubuntu:latest

MAINTAINER Mish Ochu <mishochu@contrechess.io>

# Base settings
ENV DEBIAN_FRONTEND noninteractive
ENV HOME /root

# Prepare environment
RUN \
  apt-get update -y; \
  apt-get -y install msgpack-python python-gevent python-pip python-dev tor curl git; \
  pip install --upgrade pip; \
  pip install --upgrade msgpack-python; \
  apt-get -y clean; \
  sed -i 's/^#\(ControlPort])/\1/g' /etc/tor/torrc; \
  sed -i 's/^#\(CookieAuthentication])/\1/g' /etc/tor/torrc; \
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash; \
  export NVM_DIR="$HOME/.nvm"; \
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"; \
  nvm install node; \


# Install ZeroNet
  git clone https://github.com/HelloZeroNet/ZeroNet.git zeronet; \

VOLUME ../../dist /contrechess

# Control if Tor proxy is started
ENV ENABLE_TOR true

# Set start command
# TODO: call '--tor always' conditionally too
# http://stackoverflow.com/questions/28678505/add-command-arguments-using-inline-if-statement-in-bash
CMD cd /zeronet && (! ${ENABLE_TOR} || /etc/init.d/tor start) && python zeronet.py --ui_ip 0.0.0.0 --tor always

# Expose ports
EXPOSE 43110
EXPOSE 15441
