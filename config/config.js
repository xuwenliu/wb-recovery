// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  outputPath: './cr-business',
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
          routes: [
            {
              path: '/',
              redirect: '/patriarch/childrenrecord',
            },
            {
              name: 'patriarch',
              icon: 'team',
              path: '/patriarch',
              routes: [
                {
                  name: 'childrenrecord',
                  icon: 'smile',
                  path: '/patriarch/childrenrecord',
                  component: './Patriarch/ChildrenRecord',
                },
                {
                  icon: 'smile',
                  path: '/patriarch/childrenrecord/edit',
                  component: './Patriarch/ChildrenRecord/Edit',
                  hideInMenu: true,
                },
                {
                  name: 'check',
                  icon: 'smile',
                  path: '/patriarch/check',
                  component: './scale/compose/quick',
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
                {
                  component: './404',
                },
              ],
            },
            {
              name: 'medicalexamination',
              icon: 'fundView',
              path: '/medicalexamination',
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
                {
                  icon: 'smile',
                  path: '/medicalexamination/diagnosisprescription/detail',
                  component: './MedicalExamination/DiagnosisPrescription/Detail',
                  hideInMenu: true,
                },
                {
                  component: './404',
                },
              ],
            },
            {
              name: 'assessment',
              icon: 'hourglass',
              path: '/assessment',
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
                {
                  component: './404',
                },
              ],
            },
            {
              name: 'rehabilitation',
              icon: 'medicineBox',
              path: '/rehabilitation',
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
                {
                  icon: 'smile',
                  path: '/rehabilitation/collectiveplan/edit',
                  component: './Rehabilitation/CollectivePlan/Edit',
                },
                {
                  component: './404',
                },
              ],
            },
            {
              name: 'archives',
              icon: 'file',
              path: '/archives',
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
                {
                  component: './404',
                },
              ],
            },
            {
              name: 'educational',
              icon: 'schedule',
              path: '/educational',
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
                  icon: 'smile',
                  path: '/educational/curriculum/edit',
                  component: './Educational/Curriculum/Edit',
                  hideInMenu: true,
                },

                {
                  name: 'apply',
                  icon: 'smile',
                  path: '/educational/apply',
                  component: './Educational/Apply',
                },
                {
                  component: './404',
                },
              ],
            },
            {
              name: 'function',
              icon: 'setting',
              path: '/function',
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
                  component: './scale/type',
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
                  icon: 'smile',
                  path: '/function/place/edit',
                  component: './Function/Place/Edit',
                  hideInMenu: true,
                },
                {
                  component: './404',
                },
              ],
            },
            /**
             * 量表 「開始」
             */
            {
              path: '/project',
              routes: [
                {
                  path: '/project',
                  redirect: '/project/list',
                },
                {
                  path: '/project/list',
                  component: './project/list',
                },
                {
                  path: '/project/detail',
                  component: './project/detail',
                },
                {
                  component: './404',
                },
              ],
            },
            {
              path: '/scale/compose/quick',
              Routes: ['src/pages/Authorized'],
              component: './scale/compose/quick',
            },
            {
              path: '/scale/list',
              component: './scale/list',
            },
            {
              path: '/scale/user',
              component: './scale/user/list',
            },
            {
              path: '/scale/user/detail',
              component: './scale/user/detail',
            },
            {
              path: '/scale/answer/:id',
              component: './scale/answer',
            },
            {
              path: '/scale/collect/:id',
              component: './scale/collect',
            },
            {
              path: '/scale/manage',
              component: './scale/manage',
            },
            {
              path: '/scale/record',
              component: './scale/record',
            },
            {
              path: '/scale/report/:id',
              component: './scale/report',
            },
            {
              path: '/scale/suggest/:answer',
              component: './scale/suggest',
            },
            {
              path: '/scale/compose',
              component: './scale/compose/type',
            },
            {
              path: '/scale/compose/testeeinfo',
              component: './scale/compose/testeeinfo',
            },
            {
              path: '/scale/compose/answer',
              component: './scale/compose/answer',
            },
            {
              path: '/scale/compose/answer/single',
              component: './scale/compose/answer/single',
            },
            {
              path: '/scale/compose/report',
              component: './scale/compose/report',
            },
            {
              path: '/scale/compose/:name/list',
              component: './scale/compose/list',
            },
            /**
             * 結束
             */
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
