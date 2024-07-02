const axios = require("axios");
const cron = require('node-cron');

const fetchData = async () => {
    const data = {
        "createDate": null,
        "createdBy": null,
        "modifyDate": null,
        "modifiedBy": null,
        "id": 30001,
        "voided": false,
        "code": "232001_YG111_2",
        "shortCode": "232001_YG111_2",
        "subjectId": 1651,
        "subjectName": null,
        "subjectCode": null,
        "parent": null,
        "subCourseSubjects": null,
        "isUsingConfig": false,
        "isFullClass": false,
        "courseSubjectConfigs": null,
        "timetables": [
            {
                "id": 206643,
                "endHour": null,
                "startHour": null,
                "teacher": null,
                "assistantTeacher": null,
                "room": null,
                "weekIndex": 2,
                "fromWeek": 46,
                "fromWeekStr": null,
                "toWeek": 50,
                "toWeekStr": null,
                "start": "Tiết 7",
                "end": "Tiết 9",
                "teacherName": "Lê Thị Diễn",
                "roomName": "Sân Yoga",
                "roomCode": null,
                "staffCode": null,
                "assistantStaffCode": null,
                "courseHourseStartCode": 7,
                "courseHourseEndCode": 9,
                "numberHours": null,
                "startDate": 1721001600000,
                "endDate": 1723939200000,
                "subjectName": null,
                "courseSubjectCode": null,
                "courseSubjectId": 30001,
                "group_by_key": true
            },
            {
                "id": 206644,
                "endHour": null,
                "startHour": null,
                "teacher": null,
                "assistantTeacher": null,
                "room": null,
                "weekIndex": 5,
                "fromWeek": 46,
                "fromWeekStr": null,
                "toWeek": 50,
                "toWeekStr": null,
                "start": "Tiết 7",
                "end": "Tiết 9",
                "teacherName": "Lê Thị Diễn",
                "roomName": "Sân Yoga",
                "roomCode": null,
                "staffCode": null,
                "assistantStaffCode": null,
                "courseHourseStartCode": 7,
                "courseHourseEndCode": 9,
                "numberHours": null,
                "startDate": 1721001600000,
                "endDate": 1723939200000,
                "subjectName": null,
                "courseSubjectCode": null,
                "courseSubjectId": 30001,
                "group_by_key": false
            }
        ],
        "semesterSubject": null,
        "maxStudent": 40,
        "minStudent": 0,
        "numberStudent": 0,
        "courseSubjectType": null,
        "learningSkillId": null,
        "learningSkillName": null,
        "learningSkillCode": null,
        "isSelected": false,
        "children": null,
        "hashCourseSubjects": {},
        "expanded": true,
        "isGrantAll": false,
        "isDeniedAll": false,
        "trainingBase": null,
        "isOvelapTime": false,
        "overLapClasses": [],
        "courseYearId": null,
        "courseYearCode": null,
        "courseYearName": null,
        "displayName": "Yoga-2-23 (YG111_002)",
        "numberOfCredit": 0,
        "isFeeByCourseSubject": null,
        "feePerCredit": null,
        "tuitionCoefficient": null,
        "totalFee": null,
        "feePerStudent": null,
        "enrollmentClassId": null,
        "enrollmentClassCode": null,
        "numberHours": null,
        "teacher": null,
        "teacherName": null,
        "teacherCode": null,
        "startDate": null,
        "endDate": null,
        "learningMethod": null,
        "status": 0,
        "subjectExams": null,
        "semesterId": null,
        "semesterCode": null,
        "periodId": null,
        "periodName": null,
        "username": null,
        "actionTime": null,
        "logContent": null,
        "check": false,
        "numberSubCourseSubject": 0,
        "numberLearningSkill": 0
    };

    const headers = {
        "Content-Type": "application/json",

        "Authorization": "Bearer 3abac2f1-4c78-4d13-9399-749c9b479003"
    };

    try {
        const response = await axios.post("https://sinhvien3.tlu.edu.vn:8098/education/api/cs_reg_mongo/add-register/19711/41", data, { headers });
        var enrollmentStatus = response.data.status;
        switch (enrollmentStatus) {
            case -10:
                console.log('Lỗi:', response.data.message);
                break;
            case -9:
                console.log('Lỗi:', response.data.message);
                break;
            case -8:
                console.log('Lỗi:', response.data.message);
                break;
            case -7:
                console.log('Lỗi: Bạn không có quyền đăng ký học cho sinh viên này!.');
                break;
            case -6:
                console.log('Lỗi: Hiện thời lớp đã đầy. Mời bạn đăng ký lại học phần khác.');
                break;
            case -5:
                console.log('Lỗi: Bạn cần đăng ký học phần [ ' + response.data.message + ' ] trước khi có thể đăng ký lớp học phần này.');
                break;
            case -4:
                console.log('Lỗi: Bạn đã đăng ký môn học này rồi.');
                break;
            case -2:
                console.log('Lỗi: Lớp học phần này bị trùng lịch với một lớp học phần bạn đã đăng ký.');
                break;
            case -1:
                console.log('Lỗi: Lớp học phần đã đăng ký từ trước.');
                break;
            case 0:
                console.log('Thông báo: Bạn đã đăng ký thành công lớp học phần.');
                // vm.getEligibleCourseSubjects();
                // vm.getEligibleViewObjectCourseSubjects(); // Đoạn này lấy về toàn bộ danh sách lớp học phần
                // // vm.eligibleCourseSubjects = response.data.courseRegister.listSubjectRegistrationDtos;
                // // vm.allowRegister = response.data.courseRegister.allowRegister;
                // vm.viewListCourseSubject();
                // vm.getEnrolledCourseSubjects(); // Đoạn này lấy về danh sách lớp học phần đã đăng ký
                break;
            default:
                console.log('Unknown status:', response.data, enrollmentStatus);
                break;
        }
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
};

// cron.schedule('*/5 * * * * *', async () => {
//     await fetchData();
// });

fetchData();