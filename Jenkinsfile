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

                    for i in $(seq 1 30); do
                        if docker exec greensteels-ci python -c "import urllib.request; print(urllib.request.urlopen('http://localhost:8000/health').read())"; then
                            echo "App is healthy"
                            exit 0
                        fi
                        echo "Waiting for app... attempt $i"
                        sleep 2
                    done

                    echo "App did not become healthy. Container logs:"
                    docker logs greensteels-ci
                    exit 1
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
