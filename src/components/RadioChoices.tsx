import React, { FC } from "react"
import styled from "styled-components"
import { Field } from "formik"

import FieldErrorMessage from "./FieldErrorMessage"
import FieldTitle from "./FieldTitle"

const Main = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
`

const LabelText = styled.div``

const LabelSubtitle = styled.div`
  font-size: 0.7em;
`

const Choice = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0.5em 1em;
  margin-bottom: 0.5em;
  margin-right: 0.7em;
  border-radius: 0.4em;
  border-color: #ddd;
  border-style: solid;
  border-width: 1px;
`

const ChoiceText = styled.div`
  padding-left: 0.5em;
`

interface Props {
  title?: string | null
  fieldName: string
  value: string | null
  options: Array<{
    value: string
    label: string
    subtitle?: string | null
    disabled?: boolean | null
  }>
}

const RadioChoices: FC<Props> = ({
  options,
  value,
  fieldName,
  title,
}: Props) => {
  return (
    <div>
      {title != null && <FieldTitle>{title}</FieldTitle>}
      <Main>
        {options.map(option => {
          return (
            <label key={option.value}>
              <Choice
                style={{
                  cursor: option.disabled === true ? "not-allowed" : "pointer",
                  opacity: option.disabled === true ? 0.5 : 1,
                }}
              >
                <Field
                  type="radio"
                  name={fieldName}
                  value={option.value}
                  // tslint:disable-next-line: strict-comparisons
                  checked={option.value === value}
                  style={{
                    cursor:
                      option.disabled === true ? "not-allowed" : "pointer",
                    opacity: 1,
                  }}
                  disabled={option.disabled}
                />
                <ChoiceText>
                  <LabelText>{option.label}</LabelText>
                  {option.subtitle != null && (
                    <LabelSubtitle>{option.subtitle}</LabelSubtitle>
                  )}
                </ChoiceText>
              </Choice>
            </label>
          )
        })}
      </Main>
      <FieldErrorMessage name={fieldName} />
    </div>
  )
}

export default RadioChoices
