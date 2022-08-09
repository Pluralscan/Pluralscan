## Docker

### Build and run fresh image

##### Ubuntu

```bash
mkdir pluralscan
cd pluralscan
git clone https://github.com/pluralscan/pluralscan.git
docker build -t pluralscan/pluralscan .
docker run -dp 5400:5400 pluralscan/pluralscan
```