pipeline {
    agent any
    tools {nodejs 'node16'}

    stages {
        stage('build') {
            steps {
                sh "node -v"
                echo "build"
            }
        }

        stage ('Copy Artifacts'){
            steps {
                script {
                    sh "cd source"
                    sh "node uploadFilesS3.js"
                }
            }
        }
    }
}