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
                    sh 'rm -rf uploadCache; mkdir uploadCache'

                    sh 'node buildHelpers/moveCacheBustedFiles.js'

                    // upload to S3
                    sh "aws s3 cp ./upload/resources/ s3://${env.ASSET_BUCKET_NAME}/resources/ --recursive"
                    sh "aws s3 cp ./uploadCache/resources/ s3://${env.ASSET_BUCKET_NAME}/resources/ --recursive --cache-control=public,max-age=3153600"

                }
            }
        }

        
    }
}