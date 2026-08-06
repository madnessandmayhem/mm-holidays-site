export type CampType = "Max" | "Madness" | "Madness+" | "Mayhem" | "Ineligible"

export const getSchoolYear = (dob: Date, yearOfCamp: number): number => {
  let birthYear = dob.getFullYear()
  if (dob.getMonth() < 8) {
    birthYear -= 1
  }
  // birthYear tells us the academic year they were born in
  const schoolYear = yearOfCamp - birthYear - 6
  return schoolYear
}

export const getCampFromSchoolYearAndWeek = (
  week: "1" | "2" | "3",
  schoolYear: number,
): CampType => {
  if (week === "3") {
    if (schoolYear >= 4 && schoolYear <= 6) {
      return "Max"
    } else if (schoolYear >= 7 && schoolYear <= 11) {
      return "Madness+"
    } else {
      return "Ineligible"
    }
  }

  if (schoolYear >= 4 && schoolYear <= 6) {
    return "Max"
  } else if (schoolYear >= 7 && schoolYear <= 9) {
    return "Madness"
  } else if (schoolYear >= 10 && schoolYear <= 13) {
    return "Mayhem"
  } else {
    return "Ineligible"
  }
}

export const getPrice = (
  week: "1" | "2" | "3",
  camp: CampType | null,
  gender: "Male" | "Female",
): number => {
  if (camp === null || camp === "Ineligible") {
    return 320
  }
  if (week === "3") return 299
  if (camp === "Mayhem" && gender === "Male") return 255
  return 320
}
