pipeline {
    agent any

    stages {

        stage('Checkout from GitHub') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Farzana934/selenium.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Start Minikube if not running') {
            steps {
                sh '''
                echo "Checking Minikube..."

                if minikube status >/dev/null 2>&1 && minikube status | grep -q "apiserver: Running"; then
                    echo "Minikube already running"
                else
                    echo "Resetting Minikube..."
                    minikube delete || true

                    echo "Starting Minikube..."
                    minikube start --driver=docker --memory=2048 --cpus=2 --force
                fi
                '''
            }
        }

        stage('Build Docker Image (inside Minikube)') {
            steps {
                sh '''
                echo "Switching to Minikube Docker..."
                eval $(minikube docker-env)

                echo "Building Docker image..."
                docker build -t farzanammd123/my-k8s-app:latest .

                echo "Docker image built successfully"
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-pass',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo "Logging into Docker Hub..."
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                    echo "Pushing Docker image..."
                    docker push $DOCKER_USER/my-k8s-app:latest
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                echo "Cleaning old deployment..."
                minikube kubectl -- delete deployment my-k8s-app-deployment || true

                echo "Applying Kubernetes manifests..."
                minikube kubectl -- apply -f k8s/deployment.yaml
                minikube kubectl -- apply -f k8s/service.yaml

                echo "Waiting for pods to start..."
                sleep 30

                echo "Pods status:"
                minikube kubectl -- get pods

                echo "Service URL:"
                minikube service my-k8s-app-service
                '''
            }
        }
    }
}