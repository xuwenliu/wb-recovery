// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/patriarch/baseinfo',
            },
            {
              name: 'patriarch',
              icon: 'team',
              path: '/patriarch',
              authority: ['admin'],
              routes: [
                {
                  name: 'baseinfo',
                  icon: 'smile',
                  path: '/patriarch/baseinfo',
                  component: './Patriarch/BaseInfo',
                },
                {
                  name: 'check',
                  icon: 'smile',
                  path: '/patriarch/check',
                  component: './Patriarch/Check',
                },
                {
                  name: 'medicalrecord',
                  icon: 'smile',
                  path: '/patriarch/medicalrecord',
                  component: './Patriarch/MedicalRecord',
                },
                {
                  name: 'assessmentrecord',
                  icon: 'smile',
                  path: '/patriarch/assessmentrecord',
                  component: './Patriarch/AssessmentRecord',
                },
              ],
            },
            {
              name: 'medicalexamination',
              icon: 'fundView',
              path: '/medicalexamination',
              authority: ['admin'],
              routes: [
                {
                  name: 'healthcheckup',
                  icon: 'smile',
                  path: '/medicalexamination/healthcheckup',
                  component: './MedicalExamination/HealthCheckup',
                },
                {
                  name: 'diagnosisprescription',
                  icon: 'smile',
                  path: '/medicalexamination/diagnosisprescription',
                  component: './MedicalExamination/DiagnosisPrescription',
                },
              ],
            },
            {
              name: 'assessment',
              icon: 'hourglass',
              path: '/assessment',
              authority: ['admin'],
              routes: [
                {
                  name: 'caseassessmentplanning',
                  icon: 'smile',
                  path: '/assessment/caseassessmentplanning',
                  component: './Assessment/CaseAssessmentPlanning',
                },
                {
                  name: 'teamassessment',
                  icon: 'smile',
                  path: '/assessment/teamassessment',
                  component: './Assessment/TeamAssessment',
                },
                {
                  name: 'trainingobjectives',
                  icon: 'smile',
                  path: '/assessment/trainingobjectives',
                  component: './Assessment/TrainingObjectives',
                },
                {
                  name: 'evaluationcourses',
                  icon: 'smile',
                  path: '/assessment/evaluationcourses',
                  component: './Assessment/EvaluationCourses',
                },
              ],
            },
            {
              name: 'rehabilitation',
              icon: 'medicineBox',
              path: '/rehabilitation',
              authority: ['admin'],
              routes: [
                {
                  name: 'personalplan',
                  icon: 'smile',
                  path: '/rehabilitation/personalplan',
                  component: './Rehabilitation/PersonalPlan',
                },
                {
                  name: 'collectiveplan',
                  icon: 'smile',
                  path: '/rehabilitation/collectiveplan',
                  component: './Rehabilitation/CollectivePlan',
                },
              ],
            },
            {
              name: 'archives',
              icon: 'file',
              path: '/archives',
              authority: ['admin'],
              routes: [
                {
                  name: 'childrehabilitation',
                  icon: 'smile',
                  path: '/archives/childrehabilitation',
                  component: './Archives/ChildRehabilitation',
                },
                {
                  name: 'disabledperson',
                  icon: 'smile',
                  path: '/archives/disabledperson',
                  component: './Archives/DisabledPerson',
                },
                {
                  name: 'rehabilitationarchives',
                  icon: 'smile',
                  path: '/archives/rehabilitationarchives',
                  component: './Archives/RehabilitationArchives',
                },
                {
                  name: 'overdue',
                  icon: 'smile',
                  path: '/archives/overdue',
                  component: './Archives/Overdue',
                },
              ],
            },
            {
              name: 'educational',
              icon: 'schedule',
              path: '/educational',
              authority: ['admin'],
              routes: [
                {
                  name: 'coursescheduling',
                  icon: 'smile',
                  path: '/educational/coursescheduling',
                  component: './Educational/CourseScheduling',
                },
                {
                  name: 'curriculum',
                  icon: 'smile',
                  path: '/educational/curriculum',
                  component: './Educational/Curriculum',
                },
                {
                  name: 'apply',
                  icon: 'smile',
                  path: '/educational/apply',
                  component: './Educational/Apply',
                },
              ],
            },
            {
              name: 'function',
              icon: 'setting',
              path: '/function',
              authority: ['admin'],
              routes: [
                {
                  name: 'account',
                  icon: 'smile',
                  path: '/function/account',
                  component: './Function/Account',
                },
                {
                  name: 'columnlocation',
                  icon: 'smile',
                  path: '/function/columnlocation',
                  component: './Function/ColumnLocation',
                },
                {
                  name: 'rehabilitationplan',
                  icon: 'smile',
                  path: '/function/rehabilitationplan',
                  component: './Function/RehabilitationPlan',
                },
                {
                  name: 'assessmenttool',
                  icon: 'smile',
                  path: '/function/assessmenttool',
                  component: './Function/AssessmentTool',
                },
                {
                  name: 'individualcase',
                  icon: 'smile',
                  path: '/function/individualcase',
                  component: './Function/IndividualCase',
                },
                {
                  name: 'researchproject',
                  icon: 'smile',
                  path: '/function/researchproject',
                  component: './Function/ResearchProject',
                },
                {
                  name: 'employee',
                  icon: 'smile',
                  path: '/function/employee',
                  component: './Function/Employee',
                },

                {
                  name: 'place',
                  icon: 'smile',
                  path: '/function/place',
                  component: './Function/Place',
                },
                {
                  name: 'place',
                  icon: 'smile',
                  path: '/function/place/edit',
                  component: './Function/Place/Edit',
                  hideInMenu: true,
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
