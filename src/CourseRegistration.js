import React, { useState } from "react";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

const MAX_CREDITS = 25;

const allCourses = [
  {
    code: "PRE571",
    name: "Engineering Management Economics and Administration",
    credits: 3,
    semester: 1,
  },
  {
    code: "CVE511",
    name: "Structural Mechanics III",
    credits: 2,
    semester: 1,
  },
  {
    code: "CVE513",
    name: "Design of Structures III",
    credits: 2,
    semester: 1,
  },
  {
    code: "CVE521",
    name: "Civil Engineering Hydraulics",
    credits: 2,
    semester: 1,
  },
  {
    code: "CVE523",
    name: "Engineering Hydrology I",
    credits: 2,
    semester: 1,
  },
  {
    code: "CVE531",
    name: "Highway Design",
    credits: 2,
    semester: 1,
  },
  {
    code: "CVE541",
    name: "Geotechnical Engineering",
    credits: 3,
    semester: 1,
  },
  {
    code: "CVE501",
    name: "Final Year Project I",
    credits: 2,
    semester: 1,
  },
  {
    code: "CVE581",
    name: "Laboratory/ Design Studio IV",
    credits: 3,
    semester: 1,
  },

  {
    code: "CVE515",
    name: "Advanced Structural Mechanics",
    credits: 3,
    semester: 1,
  },
  {
    code: "CVE525",
    name: "Water Resources and Environmental Engineering I",
    credits: 3,
    semester: 1,
  },
  {
    code: "CVE535",
    name: "Traffic Management, Planning and Highway Economics",
    credits: 3,
    semester: 1,
  },
  {
    code: "CVE545",
    name: "Special Topics in Geotechnical Engineering",
    credits: 3,
    semester: 1,
  },
  { code: "CVE565", name: "Building Technology I", credits: 3, semester: 1 },
  {
    code: "CVE567",
    name: "Building and Civil Engineering Measurement and Evaluation",
    credits: 3,
    semester: 1,
  },

  {
    code: "PRE572",
    name: "Engineering Management Economics II",
    credits: 3,
    semester: 2,
  },
  { code: "CVE512", name: "Structural Mechanics IV", credits: 2, semester: 2 },
  { code: "CVE514", name: "Design of Structures IV", credits: 2, semester: 2 },
  { code: "CVE522", name: "Engineering Hydrology II", credits: 2, semester: 2 },
  {
    code: "CVE542",
    name: "Geotechnical Engineering II",
    credits: 3,
    semester: 2,
  },
  {
    code: "CVE502",
    name: "Final Year Project II",
    credits: 5,
    semester: 2,
  },

  {
    code: "CVE516",
    name: "Advanced Structural Engineering II",
    credits: 3,
    semester: 2,
  },
  {
    code: "CVE526",
    name: "Water Resources and Environmental Engineering II",
    credits: 3,
    semester: 2,
  },
  {
    code: "CVE536",
    name: "Advanced Pavement Design and Construction",
    credits: 3,
    semester: 2,
  },
  {
    code: "CVE546",
    name: "Special Topics in Geotechnical Engineering",
    credits: 3,
    semester: 2,
  },
  {
    code: "CVE566",
    name: "Building Technology II",
    credits: 3,
    semester: 2,
  },
];

export default function CourseRegistration() {
  const [firstSemesterCourses, setFirstSemesterCourses] = useState([]);
  const [secondSemesterCourses, setSecondSemesterCourses] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [department, setDepartment] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [level, setLevel] = useState("");

  const filteredCourses = allCourses.filter((course) =>
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCourse = (course) => {
    const courseExists = [
      ...firstSemesterCourses,
      ...secondSemesterCourses,
    ].some((c) => c.code === course.code);
    if (courseExists) {
      alert("Course already selected.");
      return;
    }

    const semesterCourses =
      course.semester === 1 ? firstSemesterCourses : secondSemesterCourses;
    const addFunction =
      course.semester === 1
        ? setFirstSemesterCourses
        : setSecondSemesterCourses;
    const currentCredits = semesterCourses.reduce(
      (sum, c) => sum + c.credits,
      0
    );

    if (currentCredits + course.credits > MAX_CREDITS) {
      alert(`Credit limit exceeded for semester ${course.semester}`);
      return;
    }

    addFunction([...semesterCourses, course]);
    setSearchQuery("");
  };

  const handleRemoveCourse = (code, semester) => {
    if (semester === 1) {
      setFirstSemesterCourses(
        firstSemesterCourses.filter((c) => c.code !== code)
      );
    } else {
      setSecondSemesterCourses(
        secondSemesterCourses.filter((c) => c.code !== code)
      );
    }
  };

  const totalCredits = (courses) =>
    courses.reduce((sum, c) => sum + c.credits, 0);

  const handleSubmit = () => {
    if (!firstName || !lastName || !department || !matricNumber || !level) {
      alert("Please fill in all student information.");
      return;
    }

    const registrationData = {
      fullName: `${firstName} ${lastName}`,
      department,
      matricNumber,
      level,
      firstSemesterCourses,
      secondSemesterCourses,
    };

    console.log("Submitted Data:", registrationData);
    alert("Registration data saved!");
  };

  const exportJSON = () => {
    const data = {
      firstName,
      lastName,
      department,
      matricNumber,
      level,
      firstSemesterCourses,
      secondSemesterCourses,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "registration_data.json";
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    doc.text("Sessional Course Registration", 10, 10);
    doc.text(`Name: ${firstName} ${lastName}`, 10, 20);
    doc.text(`Department: ${department}`, 10, 30);
    doc.text(`Matric Number: ${matricNumber}`, 10, 40);
    doc.text(`Level: ${level}`, 10, 50);

    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(10, 55, 200, 55);

    let y = 60;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("First Semester Courses:", 10, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    firstSemesterCourses.forEach((course) => {
      doc.text(
        `- ${course.code} - ${course.name} (${course.credits} credits)`,
        10,
        y
      );
      y += 5;
    });

    y += 5;

    const firstSemesterTotalCredits = firstSemesterCourses.reduce(
      (sum, course) => sum + course.credits,
      0
    );

    doc.text(
      `Total Credits for First Semester: ${firstSemesterTotalCredits}`,
      10,
      y
    );
    y += 5;

    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(10, y, 200, y);
    y += 5;

    doc.setFont("helvetica", "bold");
    doc.text("Second Semester Courses:", 10, y);

    y += 5;

    doc.setFont("helvetica", "normal");
    secondSemesterCourses.forEach((course) => {
      doc.text(
        `- ${course.code} - ${course.name} (${course.credits} credits)`,
        10,
        y
      );
      y += 5;
    });

    const secondSemesterTotalCredits = secondSemesterCourses.reduce(
      (sum, course) => sum + course.credits,
      0
    );

    y += 5;
    doc.text(
      `Total Credits for Second Semester: ${secondSemesterTotalCredits}`,
      10,
      y
    );
    y += 5;

    doc.setLineWidth(0.5);
    doc.line(10, 15, 200, 15);

    doc.setTextColor(150, 150, 150);
    doc.text(
      "Generated by Department of Civil Engineering Course Registration System",
      10,
      290
    );

    doc.save("registration.pdf");
  };

  const exportExcel = () => {
    const data = [
      { field: "First Name", value: firstName },
      { field: "Last Name", value: lastName },
      { field: "Department", value: department },
      { field: "Matric Number", value: matricNumber },
      { field: "Level", value: level },
      ...firstSemesterCourses.map((c) => ({ semester: "1st", ...c })),
      ...secondSemesterCourses.map((c) => ({ semester: "2nd", ...c })),
    ];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Courses");
    XLSX.writeFile(workbook, "registration.xlsx");
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          Sessional Course Registration
        </h2>

        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-1/2 p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-1/2 p-2 rounded bg-gray-700 text-white"
          />
        </div>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
        >
          <option value="">Select Department</option>
          <option value="Civil Engineering">Civil Engineering</option>
          <option value="Structural Engineering">Structural Engineering</option>
        </select>

        <input
          type="text"
          placeholder="Matric Number"
          value={matricNumber}
          onChange={(e) => setMatricNumber(e.target.value)}
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        >
          <option value="">Select Level</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="300">300</option>
          <option value="400">400</option>
          <option value="500">500</option>
        </select>

        <input
          type="text"
          placeholder="Search course code (e.g., CVE514)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white mb-2"
        />

        {searchQuery && (
          <ul className="bg-gray-700 rounded p-2">
            {filteredCourses.map((course) => (
              <li
                key={course.code}
                className="flex justify-between items-center p-1"
              >
                <span>
                  {course.code} - {course.name} ({course.credits} credits)
                </span>
                <button
                  onClick={() => handleAddCourse(course)}
                  className="bg-blue-500 px-2 py-1 rounded"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        )}

        <h3 className="font-semibold mt-4">
          First Semester Courses ({totalCredits(firstSemesterCourses)} credits)
        </h3>
        <ul className="mb-4">
          {firstSemesterCourses.map((c) => (
            <li
              key={c.code}
              className="flex justify-between items-center border-b border-gray-600 py-1"
            >
              <span>
                {c.code} - {c.name} ({c.credits} credits)
              </span>
              <button
                onClick={() => handleRemoveCourse(c.code, 1)}
                className="text-red-400 hover:text-red-200"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <h3 className="font-semibold">
          Second Semester Courses ({totalCredits(secondSemesterCourses)}{" "}
          credits)
        </h3>
        <ul className="mb-4">
          {secondSemesterCourses.map((c) => (
            <li
              key={c.code}
              className="flex justify-between items-center border-b border-gray-600 py-1"
            >
              <span>
                {c.code} - {c.name} ({c.credits} credits)
              </span>
              <button
                onClick={() => handleRemoveCourse(c.code, 2)}
                className="text-red-400 hover:text-red-200"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 px-4 py-2 rounded mr-2"
        >
          Submit Courses
        </button>

        <button
          onClick={exportPDF}
          className="bg-red-600 px-4 py-2 rounded mr-2"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
