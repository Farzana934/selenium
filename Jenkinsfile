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

        stage('Build Docker Image') {
    steps {
        sh '''
        echo "Using Minikube Docker environment..."
        eval $(minikube docker-env)

        echo "Building image inside Minikube..."
        docker build -t farzanammd123/my-k8s-app:latest .
        '''
    }
}
    }
}