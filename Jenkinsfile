pipeline {
    agent any
    tools {nodejs 'node16'}

    environment {
        ASSET_BUCKET_NAME = 'hbrg-prod'
    }

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
                    sh "aws s3 ls"
                    withEnv(["ASSET_BUCKET_NAME=${env.ASSET_BUCKET_NAME}"]) {
                        sh "node source/uploadFilesS3.js"
                    }
                }
            }
        }

        
    }
}