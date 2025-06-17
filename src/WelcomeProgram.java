import javax.swing.*;
import java.awt.*;
import java.io.File;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Random;

public class WelcomeProgram extends JFrame {
	private final java.util.Map<JButton, JLabel> lotNumberLabels = new java.util.HashMap<>();

    private final ArrayList<Card> deck = new ArrayList<>();
    private final String[] effects = {"Fence", "Pool", "Park", "Temp Agency", "BIS", "Estate"};
    private final JLabel[] cardLabels = new JLabel[3];
    private final Random rand = new Random();
    private int selectedCardIndex = -1;  // Track which card is selected
    private int selectedNumber = -1;
    private String selectedEffect = "";

    public WelcomeProgram() {
        setTitle("Welcome To - Interactive Game Board");
        setSize(1000, 720); // Wider to accommodate right panel
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        // ======== Load and scale the board image ========
        ImageIcon boardIcon = new ImageIcon(getClass().getResource("/board.png")); // Ensure image is in the right path
        Image boardImage = boardIcon.getImage().getScaledInstance(600, 660, Image.SCALE_SMOOTH);

        JLabel background = new JLabel(new ImageIcon(boardImage));
        background.setBounds(0, 0, 600, 700);

        JLayeredPane layeredPane = new JLayeredPane();
        layeredPane.setPreferredSize(new Dimension(600, 700));
        layeredPane.add(background, Integer.valueOf(0));

        // ======== Lot Buttons ========
        int lotWidth = 45;
        int lotHeight = 25;
        int horizontalSpacing = 53;
        int startX = 105;
        int[] rowY = {60, 200, 340};
        char[] rows = {'A', 'B', 'C'};

        int[] lotsPerRow = {10, 11, 12}; // A, B, C

        for (int row = 0; row < 3; row++) {
            int offsetX = startX;

            // Shift for visual alignment
            if (row == 1) {
                offsetX -= 25;  // middle row (B)
            } else if (row == 2) {
                offsetX -= 50;  // bottom row (C)
            }

            for (int col = 0; col < lotsPerRow[row]; col++) {
                String label = rows[row] + String.valueOf(col + 1);
                JButton lotBtn = new JButton("");
                

                lotBtn.setBounds(offsetX + col * horizontalSpacing, rowY[row], lotWidth, lotHeight);
                lotBtn.setBackground(new Color(230, 230, 255));
                lotBtn.setFont(new Font("SansSerif", Font.BOLD, 12));
                lotBtn.setToolTipText(label);

                JLabel numberLabel = new JLabel("", SwingConstants.CENTER);
                numberLabel.setBounds(lotBtn.getBounds());
                numberLabel.setFont(new Font("SansSerif", Font.BOLD, 14));
                numberLabel.setForeground(Color.BLACK);

                lotNumberLabels.put(lotBtn, numberLabel); // <<<<<<<<<<<<<< ADD THIS LINE

                lotBtn.addActionListener(e -> {
                    if (selectedCardIndex == -1) {
                        JOptionPane.showMessageDialog(this, "Please select a card first.");
                        return;
                    }

                    JLabel labelToUpdate = lotNumberLabels.get(lotBtn);
                    if (labelToUpdate != null) {
                        labelToUpdate.setText(String.valueOf(selectedNumber));
                        labelToUpdate.setToolTipText(selectedEffect);
                        labelToUpdate.repaint(); // optional force refresh
                    }


                    lotBtn.setEnabled(false); // Disable this lot so it can't be reused
                });


                layeredPane.add(lotBtn, Integer.valueOf(3));
                layeredPane.add(numberLabel, Integer.valueOf(4)); // make label appear on top

            }
        }




        // ======== Help button ========
        JButton btnHelp = new JButton("Help");
        btnHelp.setBounds(500, 20, 80, 30);
        btnHelp.addActionListener(e -> JOptionPane.showMessageDialog(this, "Choose a card, then click a lot to place the number."));
        
        layeredPane.add(btnHelp, Integer.valueOf(2));

        // ======== RIGHT SIDE: Card Display + Draw Button ========
        JPanel rightPanel = new JPanel();
        rightPanel.setLayout(new BoxLayout(rightPanel, BoxLayout.Y_AXIS));
        rightPanel.setPreferredSize(new Dimension(180, 700));
        rightPanel.setBorder(BorderFactory.createEmptyBorder(20, 10, 20, 10));

        for (int i = 0; i < 3; i++) {
            JLabel card = new JLabel("", SwingConstants.CENTER);
            card.setPreferredSize(new Dimension(140, 80));
            card.setMaximumSize(new Dimension(140, 80));
            card.setOpaque(true);
            card.setBackground(Color.WHITE);
            card.setBorder(BorderFactory.createLineBorder(Color.BLACK, 2));
            card.setFont(new Font("SansSerif", Font.BOLD, 16));
            card.setAlignmentX(Component.CENTER_ALIGNMENT);
            final int index = i;

            card.addMouseListener(new java.awt.event.MouseAdapter() {
                public void mouseClicked(java.awt.event.MouseEvent evt) {
                    selectCard(index);
                }
            });

            cardLabels[i] = card;
            rightPanel.add(card);
            rightPanel.add(Box.createRigidArea(new Dimension(0, 20))); // spacing
        }

        JButton drawButton = new JButton("Draw Cards");
        drawButton.setAlignmentX(Component.CENTER_ALIGNMENT);
        drawButton.setMaximumSize(new Dimension(140, 40));
        drawButton.addActionListener(e -> {
            drawCards();
            clearCardSelection();
        });
        rightPanel.add(drawButton);

        // ======== Add to JFrame ========
        add(layeredPane, BorderLayout.CENTER);
        add(rightPanel, BorderLayout.EAST);

        drawCards(); // Initial draw
        pack();
    }


    // ======== Card Selection Logic ========
     private void selectCard(int index) {
        selectedCardIndex = index;

        Card selected = (Card) cardLabels[index].getClientProperty("card");
        selectedNumber = selected.getNumber();
        selectedEffect = selected.getEffect();

        for (int i = 0; i < cardLabels.length; i++) {
            cardLabels[i].setBorder(BorderFactory.createLineBorder(i == index ? Color.YELLOW : Color.BLACK, 2));
        }
    }



    private void clearCardSelection() {
        selectedCardIndex = -1;
        selectedNumber = -1;
        selectedEffect = "";
        for (JLabel card : cardLabels) {
            card.setBackground(Color.WHITE);
        }
    }

    private void drawCards() {
        initializeDeck(); // Optional: reset or shuffle
        for (int i = 0; i < 3; i++) {
            Card card = deck.remove(0); // draw top card
            cardLabels[i].setIcon(card.getImage());
            cardLabels[i].setText(""); // remove text
            cardLabels[i].putClientProperty("card", card); // store actual Card in label
            
        }
        
    }


    private void initializeDeck() {
        deck.clear();
        String[] effects = {"Fence", "Park", "Pool", "Temp Agency", "BIS", "Estate"};

        for (int i = 1; i <= 15; i++) {
            for (String effect : effects) {
                Card card = new Card(i, effect);
                if (card.isValid()) {
                    deck.add(card);
                }
            }
        }

        Collections.shuffle(deck);
    }


  public class Card {
    private int number;
    private String effect;
    private ImageIcon image;
    private boolean valid;

    public Card(int number, String effect) {
        this.number = number;
        this.effect = effect;

        String effectFormatted = formatEffect(effect);
        String filename = "/cards/" + number + "_" + effectFormatted + ".png";
        URL url = getClass().getResource(filename);

        if (url == null) {
            System.err.println("Could not find image: " + filename);
            this.image = null;
            this.valid = false;
        } else {
            Image rawImage = new ImageIcon(url).getImage();
            Image scaledImage = rawImage.getScaledInstance(100, 60, Image.SCALE_SMOOTH);
            this.image = new ImageIcon(scaledImage);
            this.valid = true;
        }
    }

    public boolean isValid() {
        return valid;
    }

    public int getNumber() {
        return number;
    }

    public String getEffect() {
        return effect;
    }

    public ImageIcon getImage() {
        return image;
    }

    @Override
    public String toString() {
        return "<html><center>" + number + "<br>" + effect + "</center></html>";
    }
}

   private String formatEffect(String effect) {
	    switch (effect.toLowerCase()) {
	        case "temp agency": return "Construction"; // match your file names
	        case "bis": return "Bis";
	        default:
	            return effect.substring(0, 1).toUpperCase() + effect.substring(1).toLowerCase();
	    }
	}




    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new WelcomeProgram().setVisible(true));
        
    }
    
}


