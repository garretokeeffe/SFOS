#!groovy

def testEmailRecipients = [
    'Fisheries_Test'
 ].join('@agriculture.gov.ie,')

def emailRecipients = [
    'Garret.Okeeffe',
    'Paul.Forde'
 ].join('@agriculture.gov.ie,')


String projectUri = 'https://rhosgitlab1.agriculture.gov.ie/fisheries-development/fisheries-ui-projects/sfos.git'

//TODO remove!
String appDownloadUri = 'http://sdbahdpci2:8081/artifactory/webapp/browserepo.html?0&pathId=libs-snapshot-local:fisheries/ieCatchSetup'
//TODO remove!
String changeLogUri = 'http://sdbahdpci2.agriculture.gov.ie:8080/view/ieCatch%203.0/job/ieCatchFE_v3_Trunk%20-%20NPM'

def exception = null
def content = null
def build_changes = null
boolean attemptedReports = false

node('master') {

  currentBuild.result = "SUCCESS"
  try {

    stage ('Checkout'){
      checkout scm
    }

    stage ('Install Dependencies' ){
      sh 'nvm use 8.11.1'
      sh 'npm run prime:leveldown'
      sh 'npm install --verbose'
    }
    
    stage ('Generate models'){ 
      sh 'npm run models:regenerate'
    }

    stage ('Run Unit Tests') {
      sh 'npm run test-coverage'
      sh 'npm run cpd'
    }

    stage ('eslint reporting') {
      publishHTML (
        allowMissing: false, 
        alwaysLinkToLastBuild: true, 
        keepAll: true,
        reportDir: './out',
        reportFiles: 'linterIssues.html', 
        reportName: 'Lint Violation Report'
      )
    }

    attemptedReports = true
    stage ('Compile & Publish Reports') {
      junit "out/karma-results/**/*.xml"
      publishHTML (
        allowMissing: false, 
        alwaysLinkToLastBuild: true, 
        keepAll: true,
        reportDir: './out/coverage',
        reportFiles: 'index.html', 
        reportName: 'Coverage Report'
      )
      dry canRunOnFailed: true, pattern: 'out/coverage/cpd-report.xml'
    }

	stage ('Build Dev'){
      sh 'npm run build'
    }	
	
//    stage ('Build Prod'){
//      sh 'npm run build:prod'
//    }

//    stage ('Build, Package electron app, installer'){
//      sh 'cd electron-wrapper && npm install'
//      sh 'cd electron-wrapper && npm run build'
//    }

//    stage ('Publish electron app, installer'){
//      sh 'cd electron-wrapper && gradle -b publish-asar.gradle publish'
//      sh 'cd electron-wrapper && gradle -b publish-installer.gradle publish'
//    }

 //   stage ('Create release content'){
//	  String uri = "http://sdbahdpci2.agriculture.gov.ie:8080/job/ieCatchFE_v3_Trunk - NPM/${env.BUILD_NUMBER}/changes"
//	  // sh 'groovy C:\\ci_server\\scripts\\last-checkin-changes.groovy "'+uri+'" > build_changes'
//    // echo ("${readFile('build_changes')}")
//    // content = readFile('build_changes').trim()
//	  content = ""
//		echo ("${content}")
//    }
    
  } catch (err) {
    echo ("LA_ERROR: Exception raised: ${err.toString()}")
    exception = err
    if (!attemptedReports) {
      stage ('Compile & Publish Reports') {
        junit "out/karma-results/**/*.xml"
        publishHTML (
          allowMissing: false, 
          alwaysLinkToLastBuild: false, 
          keepAll: false,
          reportDir: './out/coverage/lcov-report',
          reportFiles: 'index.html', 
          reportName: 'Coverage Report'
        )
      }    
    }
  } finally {
    echo ("LA_INFO: Beginning final cleanup: exception: ${exception?.toString()} | currentBuild.result = ${currentBuild.result}")
    if (exception || (currentBuild.result != 'SUCCESS')) {
      echo ("LA_INFO: Build fail detected, sending build failed email")
      currentBuild.result = "FAILURE"
    
      mail (
        body: "Project Build Error: ${exception}\n\nThe project build has failed.\nRecent changes can be seen at ${projectUri}/changes.\nFor additional information, please view the console output." ,
        from: 'jenkins-auto-build@agriculture.gov.ie',
        subject: 'sfos Angular Build Failed',
        to: emailRecipients
      )
      throw exception
    } else {
      if (content) {
        echo ("LA_INFO: No Exception detected, build success and content has changed")
        mail (
          body: "Project Build - Successful build\n\n\nSummary of Content: \n\n ${content}\n\n\nApp is ready for download at ${appDownloadUri}\n\nChanges can be seen at: ${changeLogUri}/${env.BUILD_NUMBER}/changes \n\n Unit Test Coverage can be seen at: ${changeLogUri}/${env.BUILD_NUMBER}/Coverage_Report/" ,
          from: 'jenkins-auto-build@agriculture.gov.ie',
          subject: "sfos Angular build #: ${env.BUILD_NUMBER}",
          to: testEmailRecipients,
          cc: emailRecipients
        )
    }

    // Send mail if transitioning from FAILED to SUCCESS (not on every SUCCESS)
    if(!hudson.model.Result.SUCCESS.equals(currentBuild.rawBuild.getPreviousBuild()?.getResult())) {
      echo ("LA_INFO: Build recovery detected, sending build recovered email")
      mail (
        body: "Project build is back to normal.\n${projectUri}" ,
        from: 'jenkins-auto-build@agriculture.gov.ie',
        subject: 'sfos Angular Build Passed',
        to: emailRecipients
      )
    }
    echo ("LA_INFO: Completed final cleanup")
  }
}
}
