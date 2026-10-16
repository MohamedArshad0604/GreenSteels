pipeline {
    agent any

    stages {
        stage('Build image') {
            steps {
                sh 'docker build -t greensteels-app:ci .'
            }
        }

        stage('Test') {
            steps {
                sh '''
                    docker rm -f greensteels-ci || true
                    docker run -d --name greensteels-ci greensteels-app:ci
                    sleep 5
                    docker exec greensteels-ci python -c "import urllib.request; print(urllib.request.urlopen('http://localhost:8000/health').read())"
                '''
            }
        }
    }

    post {
        always {
            sh 'docker rm -f greensteels-ci || true'
        }
    }
}
