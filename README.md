Web application for touch typing practice.

Inspired by [Gtypist](https://www.gnu.org/software/gtypist/) and [ttyper](https://github.com/max-niederman/ttyper).

Currently supports only keyboard users.

## How to add new lessons

To add a lesson to your local copy of this tutor create a file with the lesson name and extension `yml` in the folder `lessons`.

### Format of the lesson

```yml
# example.yml
pages:
  - 1:
    description: Description of the page
    text: String to type
  - 2:
    text: Another string to type
  - 3:
    description: Page with description
```
