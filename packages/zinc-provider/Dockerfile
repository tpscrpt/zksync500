FROM public.ecr.aws/lambda/nodejs:12
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
RUN cp $HOME/.cargo/bin/* /usr/local/bin
RUN cargo --version
RUN yum update -y
RUN yum install -y git openssl openssl-devel
RUN yum groupinstall -y 'Development Tools'
RUN git --version
RUN git clone https://github.com/tpscrpt/zinc
RUN cd zinc && git fetch origin fix/segfault-https:fix/segfault-https && git checkout fix/segfault-https && ./run.sh debug && cp target/debug/zargo /usr/local/bin
RUN zargo --version
