import { truncate } from "service/utils";
import { INPUT, SELECT } from "../../constants";

function getOptionsString( params ) {
  const options = [];
  options.push( params.action );
  options.push( `\`${ params.type }\`` );
  params.substring && options.push( `with \`${ truncate( params.substring, 60 ) }\`` );
  return options.join( " " );
}


export const closeDialog = {

  template: ({ params }) => `
      // Handle dialog
      bs.page.on( "dialog", async( dialog ) => {
        let result = dialog.message();
        if ( "${ params.type }" !== "any" && dialog.type() !== "${ params.type }" ) {
          return;
        }
        if ( ${ JSON.stringify( params.substring ) } && !result.includes( ${ JSON.stringify( params.substring ) } ) ) {
          return;
        }
        ${ params.action === "dismiss" ? `await dialog.dismiss();` : `` }
        ${ params.action === "accept" ? `await dialog.accept(${ JSON.stringify( params.promptText || "" ) });` : `` }
      });
  `,

  description: `Listen to dialog events and dismiss or accept dialogs (alert, beforeunload, confirm or prompt)
as they are called

**NOTE**: the step must be defined before the expected dialog event`,
  commonly: "dismiss/accept dialog",

  toLabel: ({ params }) => `(${ getOptionsString( params ) })`,
  toGherkin: ({ params }) => `Listen to dialog events and ${ params.action } any dialog
    of type \`${ params.type }\` ${ params.substring ? `with \`${ params.substring }\`` : `` }`
    + ( params.promptText  ? ` and type in it \`${ params.promptText }\`` : `` ),

  params: [
    {
      inline: true,
      legend: "",
      tooltip: "",
      fields: [

        {
          name: "params.type",
          inputStyle: { maxWidth: 200 },
          control: SELECT,
          label: "Dialog type",
          placeholder: "",
          initialValue: "any",
          options: [
            "any",
            "alert",
            "beforeunload",
            "confirm",
            "prompt"
          ],
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        },

        {
          name: "params.substring",
          control: INPUT,
          label: "Message has",
          placeholder: ""
        },

        {
          name: "params.action",
          inputStyle: { maxWidth: 200 },
          control: SELECT,
          label: "Action",
          placeholder: "",
          initialValue: "accept",
          options: [
            { value: "dismiss", description: "dismiss/close" },
            { value: "accept", description: "accept" }
          ],
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        },

        {
          name: "params.promptText",
          control: INPUT,
          label: "Prompt text has",
          tooltip: "Does not cause any effects if the dialog's type is not prompt.",
          placeholder: "(optional)"
        }
      ]
    }
  ],

  testTypes: {
    "params": {
      "substring": "INPUT",
      "type": "SELECT",
      "action": "SELECT",
      "promptText": "INPUT"
    }
  },

  test: [
    {
      valid: true,
      "params": {
        "substring": "some",
        "type": "prompt",
        "action": "accept",
        "promptText": "Lorem ipsum"
      }
    }
  ]
};


