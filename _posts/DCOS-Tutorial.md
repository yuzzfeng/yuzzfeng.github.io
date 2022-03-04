# DCOS intros for beginners at ikg

## 1. Install a SSH client

putty (https://www.putty.org/) is recommended to use, and the installation may need admin rights.

## 2. Login COCO Sever with you institute PC account (withou any subfix) and password

- host: 130.75.51.38
- port: 22
- connection type: SSH 

## 3. Install DCOS tool (only for the first time)
```
[ -d /usr/local/bin ] || mkdir -p /usr/local/bin && 
curl https://downloads.dcos.io/binaries/cli/linux/x86-64/dcos-1.10/dcos -o dcos && 
mv dcos /usr/local/bin && 
chmod +x /usr/local/bin/dcos && 
dcos cluster setup http://130.75.51.24 && 
dcos
```

## 4. Instantiate a DCOS image

For example, here "tensorflow/tensorflow:1.5.0-gpu-py3" is used. 

```
{
  "id": "/yourname-1gpu",
  "backoffFactor": 1.15,
  "backoffSeconds": 1,
  "cmd": "",
  "container": {
    "type": "MESOS",
    "volumes": [],
    "docker": {
      "image": "tensorflow/tensorflow:1.5.0-gpu-py3",
      "forcePullImage": false,
      "parameters": []
    }
  },
  "cpus": 1,
  "disk": 0,
  "instances": 0,
  "maxLaunchDelaySeconds": 3600,
  "mem": 10000,
  "gpus": 1,
  "networks": [
    {
      "mode": "host"
    }
  ],
  "portDefinitions": [],
  "requirePorts": false,
  "upgradeStrategy": {
    "maximumOverCapacity": 1,
    "minimumHealthCapacity": 1
  },
  "killSelection": "YOUNGEST_FIRST",
  "unreachableStrategy": {
    "inactiveAfterSeconds": 0,
    "expungeAfterSeconds": 0
  },
  "healthChecks": [],
  "fetch": [],
  "constraints": []
}
```

```
tail -f /dev/null
```

## 5. Run your instance

```
./dcos task exec -it yourname-1gpu bash
```

my setting
```
./dcos task exec -it feng-1gpu bash
```

## 6. Initialize GPU enviroment

```
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/nvidia/lib64 &&
export PATH=$PATH:/usr/local/nvidia/bin:/usr/local/sbin:/usr/sbin:/sbin &&
export PATH=$PATH:/opt/conda/bin &&
apt-get update &&
apt-get install cifs-utils -y &&
apt-get install git -y
```

## 7. Install pip

```
apt-get install python3-pip -y
```

## 8. Install Pytorch

pytorch/pytorch:1.6.0-cuda10.1-cudnn7-devel
```
pip3 install torch==1.6.0+cu101 torchvision==0.7.0+cu101 -f https://download.pytorch.org/whl/torch_stable.html
```

## 8. Connect to local disk at your computer
```
mkdir tmp &&
mount -t cifs -o user=,password= //130.75.51.38/tmp/yourname tmp &&
cd tmp 
```

my setting
```
mkdir tmp &&
mount -t cifs -o user=,password= //130.75.51.38/tmp/yu tmp &&
cd tmp 
```

## 9. Check your GPU availability
```
nvidia-smi
```

You will see
```
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 418.56       Driver Version: 418.56       CUDA Version: 10.1     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  GeForce GTX 108...  Off  | 00000000:84:00.0 Off |                  N/A |
| 29%   19C    P8     7W / 250W |      0MiB / 11178MiB |      0%      Default |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                       GPU Memory |
|  GPU       PID   Type   Process name                             Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+
```


## 10. Connect jupyter notebook to your local browser
```
pip3 install jupyterlab
jupyter notebook --ip=0.0.0.0 --port=8891 --no-browser --allow-root
```
Copy the link to browser and use address http://http://130.75.51.22:8891/ with the same port



## 11. Well-down! You can now work with your GPUs





## Summary

Run the following at once. Attention! this connect to yu's folder.

```
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/nvidia/lib64 &&
export PATH=$PATH:/usr/local/nvidia/bin:/usr/local/sbin:/usr/sbin:/sbin &&
export PATH=$PATH:/opt/conda/bin &&
apt-get update &&
apt-get install cifs-utils -y &&
apt-get install git -y &&
apt-get install python3-pip -y &&
pip3 install torch==1.6.0+cu101 torchvision==0.7.0+cu101 -f https://download.pytorch.org/whl/torch_stable.html &&
conda install opencv -y &&
conda install jupyterlab -y &&
mkdir tmp &&
mount -t cifs -o user=,password= //130.75.51.38/tmp/yu tmp &&
cd tmp &&
jupyter notebook --ip=0.0.0.0 --port=8891 --no-browser --allow-root
```



-----------------------------------------------------------------------------------

## TODO: Old stuffs to remove

#### install keras & image proc tools
```
pip3 install keras &&
apt-get install python3-tk -y &&
apt-get install python3-skimage -y &&
apt install gdal-bin python-gdal python3-gdal -y &&
apt install gdal-bin python-gdal python3-gdal -y
```
#### install keras-contrib
```
git clone https://www.github.com/keras-team/keras-contrib.git &&
cd keras-contrib &&
python3 setup.py install &&
cd ../
```

#### pip3 main error:
```
$ python3 -m pip uninstall pip && apt install python3-pip --reinstall
```

#### cryptography build error:
```
$ apt-get install build-essential libssl-dev libffi-dev python3-dev
```

#### example of whole script:
```
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/nvidia/lib64 &&
export PATH=$PATH:/usr/local/nvidia/bin:/usr/local/sbin:/usr/sbin:/sbin &&
apt-get update &&
apt-get install cifs-utils -y &&
apt-get install git -y &&
apt-get install python3-pip -y &&
pip3 install keras &&
pip3 install gensim &&
apt-get install python3-tk -y &&
apt-get install python3-skimage -y &&
apt install gdal-bin python-gdal python3-gdal -y &&
mkdir tmp &&
mount -t cifs -o user=,password= //130.75.51.38/tmp/yourname tmp &&
cd tmp 
```
Run a python script and delete the DCOS instance after it finished (Optional)
```
python3 simply.py
curl -X DELETE http://130.75.51.24/marathon/v2/apps/yourinstancename
```

### Connect to DCOS instance via Windows

1. Install Docker (https://www.docker.com/get-docker ) under Windows. (Skip this step for linux user!)

2. Dowload a docker image and start an instance according to this image (e.g. tensorflow/tensorflow:1.5.0-gpu ). (Skip this step for linux user!)

- First time run it
```
docker pull tensorflow/tensorflow:1.5.0-gpu                   // Download a docker image from dockerhub
docker run tensorflow/tensorflow:1.5.0-gpu                    // Run this docker iamge
docker ps                                                     // See your current working instance name
winpty docker exec -it yourDockerInstanceName bash            // Run bash on this instance
```

- Latter run it (After you restart your PC)
```
docker ps  -a                                                 // See your already shut down working instance name
docker start yourDockerInstanceName                           // Start your instance of the downloaded image
winpty docker exec -it yourDockerInstanceName bash            // Run  bash on this instance
```

3. Install dcos tool at this local docker instance with the following code (Latter do not need to install it again)
```
[ -d /usr/local/bin ] || mkdir -p /usr/local/bin && 
curl https://downloads.dcos.io/binaries/cli/linux/x86-64/dcos-1.10/dcos -o dcos && 
mv dcos /usr/local/bin && 
chmod +x /usr/local/bin/dcos && 
dcos cluster setup http://130.75.51.24 && 
dcos
```
4.  Open the GPU instance at DCOS
```
dcos task exec -it myname-2gpu bash
```

### Git Commands

```
git pull
git add -A && git commit -m "Your Message"
git push
```
