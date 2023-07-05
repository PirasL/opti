import { fireEvent, render, screen } from "@testing-library/react";
import Home from "./index";
import { DataProvider, api } from "../../contexts/DataContext";

const data = {
  events: [
    {
      id: 1,
      type: "conférence",
      date: "2022-04-29T20:28:45.744Z",
      title: "User&product MixUsers",
      cover: "/images/alexandre-pellaes-6vAjp0pscX0-unsplash.png",
      description: "Présentation des nouveaux usages UX.",
      nb_guesses: 900,
      periode: "14-15-16 Avril",
      prestations: [
        "1 espace d’exposition",
        "1 scéne principale",
        "1 espace de restaurations",
      ],
    },

    {
      id: 2,
      type: "forum",
      date: "2022-02-24T20:28:45.744Z",
      title: "Forum #productCON",
      cover: "/images/stem-list-EVgsAbL51Rk-unsplash.png",
      description:
        "Présentation des outils analytics aux professionnels du secteur",
      nb_guesses: 1300,
      periode: "24-25-26 Février",
      prestations: ["1 espace d’exposition", "1 scéne principale"],
    },
  ],
  focus: [
    {
      title: "World economic forum",
      description:
        "Oeuvre à la coopération entre le secteur public et le privé.",
      date: "2022-01-29T20:28:45.744Z",
      cover: "/images/evangeline-shaw-nwLTVwb7DbU-unsplash1.png",
    },
    {
      title: "Nordic design week",
      description: "Conférences sur le design de demain dans le digital",
      date: "2022-03-29T20:28:45.744Z",
      cover: "/images/teemu-paananen-bzdhc5b3Bxs-unsplash1.png",
    },
    {
      title: "Sneakercraze market",
      description: "Rencontres de spécialistes des Sneakers Européens.",
      date: "2022-05-29T20:28:45.744Z",
      cover: "/images/jakob-dalbjorn-cuKJre3nyYc-unsplash 1.png",
    },
  ],
};

describe("When Form is created", () => {
  it("a list of fields card is displayed", async () => {
    render(<Home />);
    await screen.findByText("Email");
    await screen.findByText("Nom");
    await screen.findByText("Prénom");
    await screen.findByText("Personel / Entreprise");
  });
  jest.useFakeTimers(); // Enable timer mocks
  describe("and a click is triggered on the submit button", () => {
    it("the success message is displayed", async () => {
      render(<Home />);
      fireEvent(
        await screen.findByText("Envoyer"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      await screen.findByText("En cours");
      jest.advanceTimersByTime(1000);
      await screen.findByText("Message envoyé !");
    });
  });
});

describe("When a page is created", () => {
  it("a list of events is displayed", async () => {
    api.loadData = jest.fn().mockReturnValue(data);
    render(
      <DataProvider>
        <Home />
      </DataProvider>
    );
    const events = await screen.findAllByTestId("card-testid");
    expect(events).toHaveLength(events.length);

    for (let i = 0; i < events.length; i++) {
      const eventItem = events[i];
      let imageContainer = eventItem.querySelector(
        ".EventCard__imageContainer"
      );
      let descriptionContainer = eventItem.querySelector(
        ".EventCard__descriptionContainer"
      );
      expect(imageContainer).toBeInTheDocument();
      expect(descriptionContainer).toBeInTheDocument();
      const image = imageContainer.firstChild;
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", `${data.events[i].cover}`);
    }
  });
  it("a list a people is displayed", () => {
    render(<Home />);
    const peoplesCards = document.querySelectorAll(".PeopleCard");
    expect(peoplesCards.length).toBe(6);
    for (let card of peoplesCards) {
      let imageContainer = card.childNodes[0].children[0];
      expect(imageContainer).toHaveAttribute("src");
      let name = card.childNodes[1].children[0];
      expect(name.textContent.length).toBeGreaterThan(0);
      let position = card.childNodes[1].children[1];
      expect(position.textContent.length).toBeGreaterThan(0);
    }
  });
  it("a footer is displayed", () => {
    render(<Home />);
    const footer = document.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });
  it("an event card, with the last event, is displayed", async () => {
    api.loadData = jest.fn().mockReturnValue(data);
    render(
      <DataProvider>
        <Home />
      </DataProvider>
    );
    const lastEvent = await screen.findByTestId("smallcard-testid");
    const lastImage = await screen.findByTestId("smallcard-image-testid");

    const lastEventTitle = lastEvent.childNodes[1].childNodes[0];
    const lastEventMonth = lastEvent.childNodes[1].childNodes[1];
    expect(lastEventTitle.textContent).toBe("User&product MixUsers");
    expect(lastEventMonth.textContent).toBe("avril");
  });
});
