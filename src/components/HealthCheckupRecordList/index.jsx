
import React, { useEffect, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { getPhysiqueList } from '@/pages/MedicalExamination/HealthCheckup/service';
import moment from 'moment';
const columns = [
    {
        title: '就诊时间',
        dataIndex: 'visitingTime',
        search: false,
        render: (_, record) => {
            return moment(record.visitingTime).format('YYYY-MM-DD');
        },
    },
    {
        title: '身高/CM',
        dataIndex: 'height',
        search: false,
    },
    {
        title: '体重/KG',
        dataIndex: 'weight',
        search: false,
    },
    {
        title: '头围/CM',
        dataIndex: 'headCircumference',
        search: false,
    },
    {
        title: '体温/度',
        dataIndex: 'bodyTemperature',
        search: false,
    },
];

const HealthCheckupRecordList = ({ patientId }) => {
    const actionRef = useRef();
    useEffect(() => {
        actionRef?.current.reload();
    }, [patientId])
    return <ProTable
        actionRef={actionRef}
        rowKey="id"
        request={(params, sorter, filter) => {
            if (patientId) {
                return getPhysiqueList({ ...params, body: patientId })
            } else {
                return {
                    data: [],
                    total: 0
                }
            }
        }}
        columns={columns}
        search={false}
    />
}
export default HealthCheckupRecordList;

