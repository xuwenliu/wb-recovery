/* eslint-disable */
import React, { Fragment } from 'react';
import {
  TextField,
  FormLabel,
  InputLabel,
  FilledInput,
  Select,
  RadioGroup,
  MenuItem,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
  Grid,
} from '@material-ui/core';
import { Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import styles from '@/utils/publicstyle';
import options from './Options';

export default function page({ form }) {
  const { getFieldDecorator, getFieldsError } = form;
  const [families, setFamilies] = React.useState([]);

  const errors = getFieldsError();

  // console.log('errs:', errors);

  const handleError = name => {
    if (errors[name]) {
      return {
        error: true,
        helperText: errors[name],
      };
    }

    return {};
  };

  return (
    <div>
      <h3>基本情况</h3>
      <Grid container justify="space-around">
        {/* {getFieldDecorator('姓名', {
          initialValue: '',
          rules: [{ required: true, message: '这道题必须回答' }],
        })(<TextField style={styles.formControl} label="姓名" {...handleError('姓名')} />)} */}
        {getFieldDecorator('年级', {
          initialValue: '',
          rules: [{ required: false, message: '这道题必须回答' }],
        })(<TextField style={styles.formControl} label="年级" {...handleError('年级')} />)}
        <FormControl style={styles.formControl} {...handleError('性别')}>
          <InputLabel>性别</InputLabel>
          {getFieldDecorator('性别', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select style={{ minWidth: 170 }}>
              {options.sex.map((i, index) => (
                <MenuItem key={index} value={i.value}>
                  {i.title}
                </MenuItem>
              ))}
            </Select>
          )}
          {errors['性别'] && <FormHelperText>{errors['性别']}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid container justify="space-around">
        {getFieldDecorator('民族', {
          rules: [{ required: false, message: '这道题必须回答' }],
        })(<TextField style={styles.formControl} label="民族" />)}
        {getFieldDecorator('籍贯', {
          rules: [{ required: false, message: '这道题必须回答' }],
        })(<TextField style={styles.formControl} label="籍贯" />)}
        <FormControl style={styles.formBlock}>
          <InputLabel>所属地域</InputLabel>
          {getFieldDecorator('所属地域', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select style={{ minWidth: 170 }}>
              {options.region.map((i, index) => (
                <MenuItem key={index} value={i.value}>
                  {i.title}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
      </Grid>
      {/* <Grid container>
        <FormControl component="fieldset" style={styles.date}>
          <FormLabel component="legend">出生年月日</FormLabel>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            {getFieldDecorator('出生年月日', {
              initialValue: new Date(),
              rules: [{ required: false, message: `请输入${name}` }],
            })(<KeyboardDatePicker variant="inline" format="yyyy/MM/dd" margin="normal" />)}
          </MuiPickersUtilsProvider>
        </FormControl>
      </Grid> */}

      <h3 style={styles.title}>身体状况</h3>
      <Grid container justify="space-around">
        <FormControl style={styles.formBlock}>
          <InputLabel>血型</InputLabel>
          {getFieldDecorator('血型', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select style={{ minWidth: 170 }}>
              {options.bloodGroup.map((i, index) => (
                <MenuItem key={index} value={i.value}>
                  {i.title}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
        {getFieldDecorator('既往病史', {
          rules: [{ required: false, message: '这道题必须回答' }],
        })(<TextField style={styles.formBlock} label="既往病史" />)}
        {getFieldDecorator('身高', {
          rules: [{ required: false, message: '这道题必须回答' }],
        })(<TextField style={styles.formBlock} label="身高" />)}
      </Grid>
      <Grid container justify="space-around">
        {getFieldDecorator('体重', {
          rules: [{ required: false, message: '这道题必须回答' }],
        })(<TextField style={styles.formSecond} label="体重" />)}
        {getFieldDecorator('家族病史', {
          rules: [{ required: false, message: '这道题必须回答' }],
        })(<TextField style={styles.formSecond} label="家族病史" />)}
        {getFieldDecorator('睡眠状况', {
          rules: [{ required: false, message: '这道题必须回答' }],
        })(<TextField style={styles.formSecond} label="睡眠状况" />)}
      </Grid>
      <Grid container justify="space-around">
        <FormControl style={styles.formBlock}>
          <InputLabel>是否近视</InputLabel>
          {getFieldDecorator('是否近视', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select style={{ minWidth: 170 }}>
              {options.primaryCaregiver.map((i, index) => (
                <MenuItem key={index} value={i.value}>
                  {i.title}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
        <FormControl style={styles.formBlock}>
          <InputLabel>是否进入青春期</InputLabel>
          {getFieldDecorator('是否进入青春期', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select style={{ minWidth: 170 }}>
              {options.primaryCaregiver.map((i, index) => (
                <MenuItem key={index} value={i.value}>
                  {i.title}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
        {getFieldDecorator('第一次出现初潮/遗精的实际年龄', {
          rules: [{ required: false, message: '这道题必须回答' }],
        })(<TextField style={styles.formSecond} label="第一次出现初潮/遗精的实际年龄" />)}
      </Grid>
      <Grid container justify="space-around">
        {getFieldDecorator('大概几岁感到自己突然快速发育', {
          rules: [{ required: false, message: '这道题必须回答' }],
        })(<TextField style={styles.formSecond} label="大概几岁感到自己突然快速发育" />)}
      </Grid>

      <h3 style={styles.title}>联系方式</h3>
      {/* {getFieldDecorator('家庭住址', {
        rules: [{ required: false, message: '这道题必须回答' }],
      })(<TextField style={{ minWidth: '93%', margin: '20px' }} label="家庭住址" />)} */}
      <FormControl style={styles.formBlock}>
        <InputLabel>目前常住情况</InputLabel>
        {getFieldDecorator('目前常住情况', {
          initialValue: '',
          rules: [{ required: false, message: '这道题必须回答' }],
        })(
          <Select style={{ minWidth: '100%' }}>
            {options.currentResidentS.map((i, index) => (
              <MenuItem key={index} value={i.value}>
                {i.title}
              </MenuItem>
            ))}
          </Select>
        )}
      </FormControl>
      {/* <Grid container justify="space-around">
        {getFieldDecorator('QQ或微信', {
          rules: [{ required: false, message: '这道题必须回答' }],
        })(<TextField style={styles.formSecond} label="QQ或微信" />)}
        {getFieldDecorator('联系电话', {
          rules: [{ required: false, message: '这道题必须回答' }],
        })(<TextField style={styles.formSecond} label="联系电话" />)}
      </Grid> */}
      <Grid container justify="space-around">
        {getFieldDecorator('邮箱', {
          rules: [{ required: false, message: '这道题必须回答' }],
        })(<TextField style={styles.formSecond} label="邮箱" />)}
      </Grid>

      <h3 style={styles.title}>家庭情况</h3>

      <Grid container justify="space-around">
        <FormControl style={styles.formControl}>
          <InputLabel>父母婚姻情况</InputLabel>
          {getFieldDecorator('父母婚姻情况', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select style={{ minWidth: '100%' }}>
              {options.parentalMaritalStatus.map((i, index) => (
                <MenuItem key={index} value={i.value}>
                  {i.title}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
        <FormControl style={styles.formControl}>
          <InputLabel>是否是独生子女</InputLabel>
          {getFieldDecorator('是否是独生子女', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select style={{ minWidth: '100%' }}>
              <MenuItem value="是">是</MenuItem>
              <MenuItem value="否">否</MenuItem>
            </Select>
          )}
        </FormControl>
        <FormControl style={styles.formControl}>
          <InputLabel>居住环境</InputLabel>
          {getFieldDecorator('居住环境', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select style={{ minWidth: '100%' }}>
              {options.general.map((i, index) => (
                <MenuItem key={index} value={i.value}>
                  {i.title}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
      </Grid>
      <Grid container justify="space-around">
        <FormControl style={styles.formControl}>
          <InputLabel>家庭年经济收入</InputLabel>
          {getFieldDecorator('家庭年经济收入', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select style={{ minWidth: '100%' }}>
              {options.annualIncome.map((i, index) => (
                <MenuItem key={index} value={i.value}>
                  {i.title}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
        <FormControl style={styles.formControl}>
          <InputLabel>家庭氛围</InputLabel>
          {getFieldDecorator('家庭氛围', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select style={{ minWidth: '100%' }}>
              {options.general.map((i, index) => (
                <MenuItem key={index} value={i.value}>
                  {i.title}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
        <FormControl style={styles.formControl}>
          <InputLabel>亲子关系</InputLabel>
          {getFieldDecorator('亲子关系', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select style={{ minWidth: '100%' }}>
              {options.general.map((i, index) => (
                <MenuItem key={index} value={i.value}>
                  {i.title}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
      </Grid>
      <Button
        color="primary"
        onClick={() => {
          setFamilies([...families, {}]);
        }}
      >
        新增家庭成员
      </Button>
      {families.map(({ 称谓, 姓名, 主要照料人 }, index) => (
        <div>
          <Grid container justify="space-around">
            <FormControl style={styles.formBlock}>
              <InputLabel>称谓</InputLabel>
              {getFieldDecorator(`家庭成员[${index}].称谓`, {
                initialValue: 称谓 || '',
                rules: [{ required: false, message: '这道题必须回答' }],
              })(
                <Select style={{ minWidth: 150 }}>
                  {options.appellation.map((i, index) => (
                    <MenuItem key={index} value={i.value}>
                      {i.title}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
            <FormControl style={styles.formBlock}>
              <InputLabel>主要照料人</InputLabel>
              {getFieldDecorator(`家庭成员[${index}].主要照料人`, {
                initialValue: 主要照料人 || '',
                rules: [{ required: false, message: '这道题必须回答' }],
              })(
                <Select style={{ minWidth: 150 }}>
                  {options.primaryCaregiver.map((i, index) => (
                    <MenuItem key={index} value={i.value}>
                      {i.title}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
            {getFieldDecorator(`家庭成员[${index}].姓名`, {
              initialValue: 姓名 || '',
              rules: [{ required: false, message: '这道题必须回答' }],
            })(<TextField style={styles.formBlock} label="姓名" />)}
          </Grid>
          <Grid container justify="space-around">
            {getFieldDecorator(`家庭成员[${index}].年龄`, {
              initialValue: 姓名 || '',
              rules: [{ required: false, message: '这道题必须回答' }],
            })(<TextField style={styles.formBlock} label="年龄" />)}
            {getFieldDecorator(`家庭成员[${index}].学历`, {
              initialValue: 姓名 || '',
              rules: [{ required: false, message: '这道题必须回答' }],
            })(<TextField style={styles.formBlock} label="学历" />)}
            {getFieldDecorator(`家庭成员[${index}].职业`, {
              initialValue: 姓名 || '',
              rules: [{ required: false, message: '这道题必须回答' }],
            })(<TextField style={styles.formBlock} label="职业" />)}
          </Grid>
          <FormControl style={styles.formBlock}>
            <InputLabel>你对他（她）的喜爱程度</InputLabel>
            {getFieldDecorator(`家庭成员[${index}].喜爱程度`, {
              initialValue: 称谓 || '',
              rules: [{ required: false, message: '这道题必须回答' }],
            })(
              <Select style={{ minWidth: '100%' }}>
                {options.loveLevel.map((i, index) => (
                  <MenuItem key={index} value={i.value}>
                    {i.title}
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>
          <Button color="primary" onClick={() => setFamilies([])}>
            删除
          </Button>
        </div>
      ))}

      <h3 style={styles.title}>学习情况</h3>
      <Grid container justify="space-around">
        <FormControl style={styles.formControl}>
          <InputLabel>学习成绩等级</InputLabel>
          {getFieldDecorator('学习成绩等级', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select style={{ minWidth: '100%' }}>
              {options.academicPerformance.map((i, index) => (
                <MenuItem key={index} value={i.value}>
                  {i.title}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
        <FormControl style={styles.formControl}>
          <InputLabel>期望学科成绩分数</InputLabel>
          {getFieldDecorator('期望学科成绩分数', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select style={{ minWidth: '100%' }}>
              {options.subjectScore.map((i, index) => (
                <MenuItem key={index} value={i.value}>
                  {i.title}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
        <FormControl style={styles.formControl}>
          <InputLabel>是否担任班级干部职务</InputLabel>
          {getFieldDecorator('是否担任班级干部职务', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select style={{ minWidth: '100%' }}>
              {options.classCadres.map((i, index) => (
                <MenuItem key={index} value={i.value}>
                  {i.title}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
      </Grid>
      <Grid container justify="space-around">
        <FormControl style={styles.formControl}>
          <InputLabel>学习兴趣</InputLabel>
          {getFieldDecorator('学习兴趣', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select style={{ minWidth: '100%' }}>
              {options.learningInterest.map((i, index) => (
                <MenuItem key={index} value={i.value}>
                  {i.title}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
        <FormControl style={styles.formControl}>
          <InputLabel>学习动机</InputLabel>
          {getFieldDecorator('学习动机', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select style={{ minWidth: '100%' }}>
              {options.learningMotivation.map((i, index) => (
                <MenuItem key={index} value={i.value}>
                  {i.title}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
        <FormControl style={styles.formControl}>
          <InputLabel>学习压力</InputLabel>
          {getFieldDecorator('学习压力', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select style={{ minWidth: '100%' }}>
              {options.learningStress.map((i, index) => (
                <MenuItem key={index} value={i.value}>
                  {i.title}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
      </Grid>
      <Grid container justify="space-around">
        <FormControl style={styles.formControl}>
          <InputLabel>考试焦虑</InputLabel>
          {getFieldDecorator('考试焦虑', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select style={{ minWidth: '100%' }}>
              {options.examinationPressure.map((i, index) => (
                <MenuItem key={index} value={i.value}>
                  {i.title}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
        <FormControl style={styles.formSecond}>
          <InputLabel>自控能力</InputLabel>
          {getFieldDecorator('自控能力', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select>
              {options.selfontrolAbility.map((i, index) => (
                <MenuItem key={index} value={i.value}>
                  {i.title}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
      </Grid>

      <h3 style={styles.title}>人际关系</h3>
      <Grid container justify="space-around">
        <FormControl style={styles.formSecond}>
          <InputLabel>目前与老师的关系</InputLabel>
          {getFieldDecorator('人际关系.目前与老师的关系', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select style={{ minWidth: '100%' }}>
              {options.relationshipWithTeacher.map((i, index) => (
                <MenuItem key={index} value={i.value}>
                  {i.title}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
        <FormControl style={styles.formSecond}>
          <InputLabel>喜欢主动与老师进行交流吗？</InputLabel>
          {getFieldDecorator('人际关系.喜欢主动与老师进行交流吗？', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select style={{ minWidth: '100%' }}>
              {options.communicationWithTeachers.map((i, index) => (
                <MenuItem key={index} value={i.value}>
                  {i.title}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
      </Grid>
      <Grid container justify="space-around">
        <FormControl style={styles.formSecond}>
          <InputLabel>目前与同学的关系</InputLabel>
          {getFieldDecorator('人际关系.目前与同学的关系', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select style={{ minWidth: '100%' }}>
              {options.relationshipWithClassmates.map((i, index) => (
                <MenuItem key={index} value={i.value}>
                  {i.title}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
        <FormControl style={styles.formSecond}>
          <InputLabel>你有几个朋友可以吐露心声？</InputLabel>
          {getFieldDecorator('人际关系.你有几个朋友可以吐露心声？', {
            initialValue: '',
            rules: [{ required: false, message: '这道题必须回答' }],
          })(
            <Select style={{ minWidth: '100%' }}>
              {options.confess.map((i, index) => (
                <MenuItem key={index} value={i.value}>
                  {i.title}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
      </Grid>
    </div>
  );
}
