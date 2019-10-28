FROM nvidia/cuda:10.0-runtime-ubuntu16.04
ENV PATH /opt/conda/bin:$PATH
COPY conda.yml .
RUN apt-get update --fix-missing && apt-get install -y wget bzip2 ca-certificates \
    libglib2.0-0 libxext6 libsm6 libxrender1 \
    git mercurial subversion

RUN wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh && \
    /bin/bash ~/miniconda.sh -b -p /opt/conda && \
    rm ~/miniconda.sh && \
    echo "source activate base" >> ~/.bashrc

RUN conda update conda -n root && conda env update -f conda.yml -n base