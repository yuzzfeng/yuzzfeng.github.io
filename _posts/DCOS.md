# List of workable DCOS setting

## Setting for object detection

Workable for:

- matterport/Mask_RCNN

Docker container Image: 

- pytorch/pytorch:1.2-cuda10.0-cudnn7-devel

```
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/nvidia/lib64 &&
export PATH=$PATH:/usr/local/nvidia/bin:/usr/local/sbin:/usr/sbin:/sbin &&
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/cuda-10.0/lib64 &&
export PATH=$PATH:/usr/local/cuda-10.0/bin:/usr/local/sbin:/usr/sbin:/sbin &&
export CUDA_HOME=$CUDA_HOME:/usr/local/cuda-10.0 &&
export PATH=$PATH:/opt/conda/bin &&
apt-get update &&
apt-get install cifs-utils -y &&
apt-get install wget -y &&
conda install tensorflow-gpu==1.14.0 -y &&
conda install keras==2.3.1 -y &&
conda install imgaug -y &&
conda install -c conda-forge notebook -y &&
conda install -c conda-forge pycocotools -y &&
conda install -c conda-forge opencv -y &&
conda install -c conda-forge scikit-image -y &&
mkdir tmp &&
mount -t cifs -o user=,password= //130.75.51.38/tmp/yu tmp &&
cd tmp &&
jupyter notebook --ip=0.0.0.0 --port=8891 --no-browser --allow-root 



python3 -m pip install detectron2==0.2.1 -f   https://dl.fbaipublicfiles.com/detectron2/wheels/cu100/torch1.4/index.html &&

wget https://download.pytorch.org/whl/cu100/torch-1.4.0%2Bcu100-cp36-cp36m-linux_x86_64.whl && 
wget https://download.pytorch.org/whl/cu100/torchvision-0.5.0%2Bcu100-cp36-cp36m-linux_x86_64.whl && 
python3 -m pip install torch-1.4.0+cu100-cp36-cp36m-linux_x86_64.whl && 
python3 -m pip install torchvision-0.5.0+cu100-cp36-cp36m-linux_x86_64.whl

conda install pillow==7.1.2 -y &&
```
