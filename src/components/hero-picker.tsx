import React, { useState, useEffect, useRef } from "react";
// import ReactDOM from "react-dom";
import { IPersonaProps, Persona, PersonaSize, PersonaPresence } from "@fluentui/react/lib/Persona";
import { IBasePickerSuggestionsProps, NormalPeoplePicker } from "@fluentui/react/lib/Pickers";
import { Text } from "@fluentui/react/lib/Text";
import { MessageBar } from "@fluentui/react/lib/MessageBar";
import { Icon } from "@fluentui/react/lib/Icon";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { Panel } from "@fluentui/react/lib/Panel";
import { TextField } from "@fluentui/react/lib/TextField";
import { Separator } from "@fluentui/react/lib/Separator";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import { createTheme, ITheme } from "@fluentui/react/lib/Styling";
import { useBoolean } from "@fluentui/react-hooks";
import HeroHelper from "../helper/hero-helper";

initializeIcons(undefined, { disableWarnings: true });

export interface IMainProps {
  text: string;
}

const marginStyles = {
  root: {
    margin: 10,
  },
};

const theme: ITheme = createTheme({
  fonts: {
    medium: {
      fontFamily: "Monaco, Menlo, Consolas",
      fontSize: "30px",
    },
  },
});

const suggestionProps: IBasePickerSuggestionsProps = {
  suggestionsHeaderText: "Suggested People",
  mostRecentlyUsedHeaderText: "Suggested Contacts",
  noResultsFoundText: "No results found",
  loadingText: "Loading",
  showRemoveButtons: true,
  suggestionsAvailableAlertText: "People Picker Suggestions available",
  suggestionsContainerAriaLabel: "Suggested contacts",
};

const HeroPicker = (props: IMainProps): JSX.Element => {
  const [heroPersonaList, setHeroPersonaList] = React.useState<IPersonaProps[]>([]);
  const [heroPersona, setHeroPersona] = React.useState<IPersonaProps>({});
  const [heroList, setHeroList] = React.useState<any[]>([]);
  const [selectedHero, setSelectedHero] = React.useState<any>();
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);

  useEffect(() => {
    const fetchHeros = async () => {
      let data: any[] = await HeroHelper.GetAllHeros();
      setHeroList(data.map((en) => en));
      setHeroPersonaList(
        data.map((en) => {
          let persona: IPersonaProps = {};
          persona.text = en.pmav_name;
          persona.secondaryText = en.pmav_publisher;
          return persona;
        }),
      );
    };
    fetchHeros();
  }, []);

  const onFilterChanged = (
    filterText: string,
    currentPersonas: IPersonaProps[] | undefined,
    limitResults?: number,
  ): IPersonaProps[] | Promise<IPersonaProps[]> => {
    if (filterText) {
      let filteredPersonas: IPersonaProps[] = filterPersonasByText(filterText);

      filteredPersonas = removeDuplicates(filteredPersonas, currentPersonas);
      filteredPersonas = limitResults ? filteredPersonas.slice(0, limitResults) : filteredPersonas;

      return filteredPersonas;
    } else {
      return [];
    }
  };

  const onItemSelected = (item: IPersonaProps | undefined): Promise<IPersonaProps> => {
    if (item) {
      setHeroPersona(item);

      let filteredHeros = heroList.filter((h) => h.pmav_name === (item.text ?? ""));
      setSelectedHero(filteredHeros[0]);
    }
    return new Promise<IPersonaProps>((resolve, reject) => item);
  };

  const showHeroDetails = () => {
    openPanel();
    console.log(selectedHero);
  };

  const filterPersonasByText = (filterText: string): IPersonaProps[] => {
    return heroPersonaList.filter((item) => doesTextStartWith(item.text as string, filterText));
  };

  return (
    <>
      <MessageBar>This is a demo app on how to create React app for Dataverse in a supported way.</MessageBar>
      <div>
        <Text variant={"xLarge"} nowrap block>
          {props.text}
        </Text>
        <NormalPeoplePicker
          onResolveSuggestions={onFilterChanged}
          pickerSuggestionsProps={suggestionProps}
          key={"normal"}
          itemLimit={1}
          inputProps={{
            onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log("onBlur called"),
            onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log("onFocus called"),
            "aria-label": "Hero Picker",
          }}
          onItemSelected={onItemSelected}
          resolveDelay={300}
          styles={marginStyles}
        />
      </div>
      <Persona
        {...heroPersona}
        size={PersonaSize.size72}
        presence={PersonaPresence.offline}
        onRenderSecondaryText={onRenderSecondaryText}
        styles={marginStyles}
      />
      <PrimaryButton text="Show Details" onClick={showHeroDetails} styles={marginStyles} />
      <Panel
        isLightDismiss
        isOpen={isOpen}
        onDismiss={dismissPanel}
        closeButtonAriaLabel="Close"
        headerText="Hero Details"
      >
        <Text variant={"xxLarge"} nowrap block>
          {selectedHero?.pmav_name ?? "--"}
        </Text>
        <TextField label="Comic Publisher" readOnly defaultValue={selectedHero?.pmav_publisher ?? "--"} />
        <TextField label="Gender" readOnly defaultValue={selectedHero?.pmav_gendername ?? "--"} />
        <TextField label="Heigth (cm)" readOnly defaultValue={selectedHero?.pmav_heightcm ?? "--"} />
        <TextField label="Race" readOnly defaultValue={selectedHero?.pmav_race ?? "--"} />
        <TextField label="Hair Color" readOnly defaultValue={selectedHero?.pmav_haircolor ?? "--"} />
        <TextField label="Eye Color" readOnly defaultValue={selectedHero?.pmav_eyecolor ?? "--"} />
        <TextField label="Alignment" readOnly defaultValue={selectedHero?.pmav_alignmentname ?? "--"} />
        <Separator theme={theme}>Stats</Separator>
        <TextField label="Strength" readOnly defaultValue={selectedHero?.pmav_stats_strength ?? "--"} />
        <TextField label="Combat" readOnly defaultValue={selectedHero?.pmav_stats_combat ?? "--"} />
        <TextField label="Speed" readOnly defaultValue={selectedHero?.pmav_stats_speed ?? "--"} />
        <TextField label="Power" readOnly defaultValue={selectedHero?.pmav_stats_power ?? "--"} />
        <TextField label="Durability" readOnly defaultValue={selectedHero?.pmav_stats_durability ?? "--"} />
        <TextField label="Intelligence" readOnly defaultValue={selectedHero?.pmav_stats_intelligence ?? "--"} />
      </Panel>
    </>
  );
};

function onRenderSecondaryText(props: IPersonaProps | undefined): JSX.Element {
  return (
    <div>
      <Icon iconName="MyMoviesTV" /> {props?.secondaryText}
    </div>
  );
}

function removeDuplicates(personas: IPersonaProps[], possibleDupes: IPersonaProps[] | undefined) {
  return personas.filter((persona) => !listContainsPersona(persona, possibleDupes));
}

function listContainsPersona(persona: IPersonaProps, personas: IPersonaProps[] | undefined) {
  if (!personas || !personas.length || personas.length === 0) {
    return false;
  }
  return personas.filter((item) => item.text === persona.text).length > 0;
}

function doesTextStartWith(text: string, filterText: string): boolean {
  return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
}

export default HeroPicker;
