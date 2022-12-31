FROM debian:9
WORKDIR /app
COPY package.json /app
COPY . /app
RUN cd / \
&& apt-get update -yq \
&& apt-get install curl gnupg -yq \
&& curl -sL https://deb.nodesource.com/setup_10.x | bash \
&& apt-get install nodejs -yq \
&& apt-get clean -y \
&& cd / \
&& yes | apt-get install openjdk-8-jdk \
&& apt-get install wget \
&& wget https://services.gradle.org/distributions/gradle-6.3-all.zip -P /tmp \
&& apt-get install unzip \
&& unzip -d /opt/gradle /tmp/gradle-*.zip \
&& echo "export GRADLE_HOME=/opt/gradle/gradle-6.3" >> /etc/profile.d/gradle.sh \
&& echo "export PATH=\${GRADLE_HOME}/bin:\${PATH}" >> /etc/profile.d/gradle.sh \
&& chmod +x /etc/profile.d/gradle.sh \
&& /bin/bash -c "source /etc/profile.d/gradle.sh" \
&& export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64/ \
&& yes | apt install android-sdk \
&& export ANDROID_HOME=/usr/lib/android-sdk \
&& export ANDROID_SDK_ROOT=/usr/lib/android-sdk \
&& export PATH=$PATH:$ANDROID_HOME/tools \
&& export PATH=$PATH:$ANDROID_HOME/platform-tools \
&& cd usr/lib/android-sdk/ \
&& mkdir test && wget https://dl.google.com/android/repository/commandlinetools-linux-6609375_latest.zip \
&& unzip commandlinetools-linux-6609375_latest.zip -d cmdline-tools \
&& export PATH=$ANDROID_HOME/cmdline-tools/tools/bin:$PATH \
&& cd licenses/ && yes | sdkmanager --licenses \
&& cd /app \
&& npm install \
&& cd ./android && ./gradlew assembleRelease