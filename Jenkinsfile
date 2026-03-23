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

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t my-k8s-app:${BUILD_NUMBER} .
                docker tag my-k8s-app:${BUILD_NUMBER} farzanammd123/my-k8s-app:latest
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

        stage('Deploy to Kubernetes') {
    steps {
        sh '''
        echo "Loading image into Minikube..."
        minikube image load farzanammd123/my-k8s-app:latest

        echo "Applying Kubernetes manifests..."
        minikube kubectl -- apply -f k8s/deployment.yaml
        minikube kubectl -- apply -f k8s/service.yaml

        echo "Waiting for pods..."
        sleep 20

        minikube kubectl -- get pods

        echo "Accessing service..."
        minikube service my-k8s-app-service
        '''
    }
}
    }
}