#!/usr/bin/env python3
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt

# Scaling parameters
scaling_params = {
    "L_0": 1.69,
    "N_c": 4.714e7,
    "D_c": 2.158e9,
    "alpha_N": 0.34,
    "alpha_D": 0.28,
}

def get_loss(N, C, scaling_params):
    """Calculate loss given N parameters and C compute"""
    L_0 = scaling_params["L_0"]
    N_c = scaling_params["N_c"]
    D_c = scaling_params["D_c"]
    alpha_N = scaling_params["alpha_N"]
    alpha_D = scaling_params["alpha_D"]
    
    D = C / (6 * N)  # Constraint: C = 6ND
    return L_0 + (N_c/N)**alpha_N + (D_c/D)**alpha_D

def find_C_where_N_is_optimal(N_target, scaling_params):
    """
    Find the C value such that N_target minimizes the loss for that fixed C.
    This gives us the compute-optimal frontier.
    """
    N_c = scaling_params["N_c"]
    D_c = scaling_params["D_c"]
    alpha_N = scaling_params["alpha_N"]
    alpha_D = scaling_params["alpha_D"]
    
    # Derived formula for C where N_target is the minimizer
    C_optimal = 6 * D_c * (alpha_D/alpha_N)**(1/alpha_D) * (N_target/N_c)**(alpha_N/alpha_D) * N_target
    
    # Calculate loss at this point
    L_optimal = get_loss(N_target, C_optimal, scaling_params)
    
    return C_optimal, L_optimal

# Range of N values
n_values = np.logspace(8, 13, 1000)  # From 10^8 to 10^13

# COMPUTE-OPTIMAL FRONTIER
# For each N, find C such that N minimizes loss for that C
compute_optimal_C = []
compute_optimal_loss = []

for N in n_values:
    C_opt, L_opt = find_C_where_N_is_optimal(N, scaling_params)
    compute_optimal_C.append(C_opt)
    compute_optimal_loss.append(L_opt)

compute_optimal_C = np.array(compute_optimal_C)
compute_optimal_loss = np.array(compute_optimal_loss)

# INFINITE COMPUTE CURVE (D→∞)
L_0 = scaling_params["L_0"]
N_c = scaling_params["N_c"]
alpha_N = scaling_params["alpha_N"]
infinite_compute_loss = L_0 + (N_c/n_values)**alpha_N

# Define nice colors
color_1 = np.array([255, 105, 180, 0.6 * 255]) / 255  # Pink-ish
color_2 = np.array([0, 191, 255, 0.6 * 255]) / 255     # Blue-ish

# Define colors for the 4 horizontal bands/areas
area_colors = {
    'area1': '#cccacc',  # Light pink - Bottom area (y-min to 100B×optimal)
    'area2': '#eb9bdf',  # Lavender - (100B×optimal to 1B×infinite)
    'area3': '#abe0a4',  # Azure - (1B×infinite to 1B×optimal)
    'area4': '#b9e0fa',  # Cornsilk - Top area (1B×optimal to y-max)
}
area_alpha = 0.3  # Transparency for all areas

# Apply global settings from niceplots style
plt.rcParams['figure.figsize'] = [14, 9]
plt.rcParams['figure.dpi'] = 200
plt.rcParams['font.size'] = 25

# CREATE THE PLOT
fig, ax = plt.subplots(figsize=(14, 9))

# Removed fixed-C curves as requested

# Plot the main curves with nice colors and thicker lines
ax.plot(n_values, compute_optimal_loss, '-', linewidth=5, 
        color=color_2[:3], label='Compute-Optimal Frontier', zorder=2)
ax.plot(n_values, infinite_compute_loss, '-', linewidth=5, 
        color=color_1[:3], label='Infinite Compute', zorder=2)

# Add vertical lines at key model sizes
ax.axvline(x=1e9, color='black', linestyle=':', linewidth=2, alpha=0.7)
ax.axvline(x=1e11, color='black', linestyle=':', linewidth=2, alpha=0.7)

# Calculate losses at the intersections
# For N=1e9
C_1e9, L_1e9_blue = find_C_where_N_is_optimal(1e9, scaling_params)
L_1e9_red = L_0 + (N_c/1e9)**alpha_N

# For N=1e11
C_1e11, L_1e11_blue = find_C_where_N_is_optimal(1e11, scaling_params)
L_1e11_red = L_0 + (N_c/1e11)**alpha_N

# No horizontal lines - removed as requested

# Define the 4 areas as specified:
# Area 1: ylim min (1.6) to 100B x optimal (L_1e11_blue)
# Area 2: 100B x optimal (L_1e11_blue) to 1B x infinite (L_1e9_red)
# Area 3: 1B x infinite (L_1e9_red) to 1B x optimal (L_1e9_blue)
# Area 4: 1B x optimal (L_1e9_blue) to top (3.25)

# Add the 4 colored areas using the colors defined at the top
ax.axhspan(1.6, L_1e11_blue, facecolor=area_colors['area1'], alpha=area_alpha, zorder=0)         # Area 1
ax.axhspan(L_1e11_blue, L_1e9_red, facecolor=area_colors['area2'], alpha=area_alpha, zorder=0)   # Area 2
ax.axhspan(L_1e9_red, L_1e9_blue, facecolor=area_colors['area3'], alpha=area_alpha, zorder=0)    # Area 3
ax.axhspan(L_1e9_blue, 3.25, facecolor=area_colors['area4'], alpha=area_alpha, zorder=0)         # Area 4

# Set scales and limits
ax.set_xscale('log')
ax.set_yscale('log')
ax.set_xlim(2e8, 5e11)
ax.set_ylim(1.6, 3.25)

# Set custom x-axis ticks and labels
ax.set_xticks([1e9, 1e10, 1e11])
ax.set_xticklabels(['1B', '10B', '100B'])

# No labels - removed as requested
# No title - removed as requested

# No legend - removed as requested

# Apply the nice plot style (remove top and right spines, thicken remaining)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_linewidth(3)
ax.spines['bottom'].set_linewidth(3)

# Ensure spines are on top of plot elements
ax.spines['left'].set_zorder(10)
ax.spines['bottom'].set_zorder(10)

# Tick parameters
ax.tick_params(axis='both', which='major', labelsize=28, length=6, width=2, pad=10)

# Remove x minor ticks
ax.tick_params(axis='x', which='minor', bottom=False)

# Set y-axis ticks manually at 2 and 3
import matplotlib.ticker as ticker
ax.yaxis.set_major_locator(ticker.FixedLocator([2, 3]))
ax.yaxis.set_major_formatter(ticker.FuncFormatter(lambda x, p: f'{int(x)}'))
ax.yaxis.set_minor_locator(ticker.NullLocator())  # Remove minor ticks

fig.tight_layout()

# Save the figure
output_file = 'scaling_frontier.png'
plt.savefig(output_file, dpi=150, bbox_inches='tight')
print(f"Plot saved to: {output_file}")

