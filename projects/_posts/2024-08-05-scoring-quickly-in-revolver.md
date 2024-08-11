---
title: The Scoring logic of Revolver
catagory: projects revolver
authour: Lucy
tags: machine-learning algorithms
pre-text: Before I start, I would highly recommend reading [this article](https://cowboyprogramming.com/2007/01/04/programming-poker-ai/) by Mick West. It was invaluable in getting me on the right track with this project back in high-school.
layout: post
---

Creating a poker playing machine must first start with scoring poker hands. After all what good is a player if they think the winner is randomly determined.

However, before we ask how to score a hand we must first look at how to represent the hand in memory. In 2018 I did this with vectors of `u8`, because I had not read that article before I started. Now, _Revolver_ uses a `u64` that is similar in construction to West's, but different in some key ways.

## The hand

_Revolver_ it isn't really important which suit is which so I will not annotate
them here, but here is a rough blueprint of the hand.

```none
0x0000000000000
  ││││││││││││└─Twos nible
  │││││││││││└──Threes nible
  ││││││││││└───Fours nibble
  │││││││││└────Fives nibble
  ││││││││└─────Sixs nibble
  │││││││└──────Sevens nibble
  ││││││└───────Eights nibble
  │││││└────────Nines nibble
  ││││└─────────Tens nibble
  │││└──────────Jacks nibble
  ││└───────────Queens nibble
  │└────────────Kings nibble
  └─────────────Aces nibble

// One nibble
0b0000
  │││└─Suit one
  ││└──Suit two
  │└───Suit three
  └────Suit four
```

However when scoring we are more interested in the number of cards of a particular value. Therefor I created the "doubles notation" hand.

```none
0b0000000000001000000000000100000000000010000000000001
              │            │            │            └─Single two
              │            │            └──────────────Pair of twos
              │            └───────────────────────────Triple Twos
              └────────────────────────────────────────Quadruple twos
```

This structure allows us to easily test for various hands and score them. For example if we have a four of a kind we can just do a bitwise and over the bits 39 to 52, if the result is not 0, we shift the result right by 39 bits and xor the singles.

```rust
fn check_for_quadruple(doubles_notation_hand: u64) -> u64 {
  let quads = doubles_notation_hand & 0x1fff << (13*3);
  if quads != 0 {
    let single = (doubles_notation_hand & 0x1fff) ^ (quads >> (13*3));
    return single | quads;
  }
  return 0;
}
```

But we still need the naive implementation of the hand structure, if only for straight flushes and regular flushes.

```rust
fn check_for_flushes(naive_hand: &u64) -> u64 {
  let mut flush_mask = 0x8888888888888;
  for _ in 0..4 {
    if (naive_hand & flush_mask).count_ones() > 5 {
      return naive_hand & flush_mask;
    }
    flush_mask >>= 1;
  }
  return 0;
}
```

Finally we want to do some tests to see if there are straights, but this can be simplified by the hand structures we have already.

```rust
fn check_for_straights(naive_hand: &u64, doubles_notation_hand: &u64) -> u64 {
  let mut straight_flush_mask = 0x8888800000000;

  // Check eight values (since the mask covers 5 values at a time)
  for _ in 0..(52 - 5 * 4) {
    if (naive_hand & straight_flush_mask).count_ones() == 5 {
      return naive_hand & straight_flush_mask;
    }
    straight_flush_mask >>= 1;
  }
  // Also check for ace low
  straight_flush_mask |= 0x8000000000000;
  for _ in 0..4 {
    if (naive_hand & straight_flush_mask).count_ones() == 5 {
      return naive_hand & straight_flush_mask & 0x8888;
    }
    straight_flush_mask >>=1;
  }

  //start checking for straights

  let mut straight_mask = 0b1111100000000

  //only check the first 8 values, since the mask covers 5 values
  for _ in 0..(13 - 5) {
    if (doubles_notation_hand & straight_mask).count_ones() == 5 {
      return doubles_notation_hand & straight_mask;
    }
    straight_mask >>= 1;
  }

  //Check for ace low here as well
  if (straight_mask | 0b1000000000000
      & doubles_notation_hand).count_ones() == 5 {
      return straight_mask & doubles_notation_hand;
    }

  return 0;
}
```

Now we have a bunch of scored hands, but no way to really sort them. Because of this we should return a key for the type of hand that was scored when we score them. Since we only have 52 bits reserved for the hand type we have 12 bits left to play with here, and luckily only 9 scoring hands to encode (assuming no jokers).

Once we have returned a bit that tells us what type of hand was scored we can then return the highest value using simple arithmetic comparison since when we look for the kinds of hands that include repeated cards (pairs, three of a kind, full house, etc.) we won't be looking for hands like flushes and straights.

Now returned hands should look like this `0x80 88 88 80 00 00 00` for a straight flush from ace to ten; `0x0x40 08 00 00 00 00 08 00` for a four of a kind ace with a king kicker; or `0x0E C0` for a high card hand with a king, queen, jack, nine, and eight.
