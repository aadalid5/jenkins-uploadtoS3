pipeline {
    agent any
    tools {nodejs 'node16'}

    environment {
        ASSET_BUCKET_NAME = 'demo-cloudfront-ariel-v1'
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
                    sh 'rm -rf upload; mkdir upload'
                    sh 'cp -r source/resources upload/resources'

                    withEnv(["ASSET_BUCKET_NAME=${env.ASSET_BUCKET_NAME}"]) {
                        sh "node source/uploadFilesS3.js"
                    }
                }
            }
        }

        
    }
}