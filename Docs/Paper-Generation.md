# Paper Generation

## Purpose

Generate examination papers from the question bank.

## Inputs

* Subject
* Total Questions
* Question Distribution
* Teacher Filters
* Seed (Optional)

## Validation

Verify:

* Subject exists
* Enough questions exist
* Distribution is achievable

## Selection Rules

Example:

* 20 MCQs
* 10 Short Questions
* 5 Long Questions

Questions must be randomly selected.

If a seed is provided, generation must be deterministic.

## Output

Paper Model

Contains:

* Header
* Sections
* Selected Questions
* Marks Summary

The output is not a PDF.
